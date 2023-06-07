package client

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

const (
	// acceptHeader is the Accept header.
	acceptHeader = "Accept"

	// contentType specifies the JSON Content-Type header value.
	contentType       = "application/json"
	contentTypeHeader = "Content-Type"

	// fernLanguage specifies the value of the X-Fern-Language header.
	fernLanguage       = "go"
	fernLanguageHeader = "X-Fern-Language"

	// fernSDKName specifies the name of this Fern SDK.
	fernSDKName       = "fern-go-client"
	fernSDKNameHeader = "X-Fern-SDK-Name"

	// fernSDKVersion specifies the version of this Fern SDK.
	fernSDKVersion       = "0.0.1"
	fernSDKVersionHeader = "X-Fern-SDK-Version"
)

// fernHeaders specifies all of the standard Fern headers in
// a set so that they're easier to access and reference.
var fernHeaders = map[string]string{
	acceptHeader:         contentType,
	contentTypeHeader:    contentType,
	fernLanguageHeader:   fernLanguage,
	fernSDKNameHeader:    fernSDKName,
	fernSDKVersionHeader: fernSDKVersion,
}

// Doer is an interface for a subset of the *http.Client.
type Doer interface {
	Do(*http.Request) (*http.Response, error)
}

// ClientOption adapts the behavior of a Fern client.
type ClientOption func(*clientOptions)

// CallOption adapts the behavior of a an individual endpoint.
type CallOption interface{}

// clientOptions holds all of the configuration options for
// a Fern client. There are none for now.
type clientOptions struct{}

// callOptions holds all of the configuration options for
// an endpoint call. There are none for now.
type callOptions struct{}

// doRequest issues a JSON request to the given url.
func doRequest(
	ctx context.Context,
	client Doer,
	url string,
	method string,
	request any,
	response any,
) error {
	requestBytes, err := json.Marshal(request)
	if err != nil {
		return err
	}
	req, err := newRequest(ctx, url, method, bytes.NewReader(requestBytes))
	if err != nil {
		return err
	}

	// If the call has been cancelled, don't issue the request.
	if err := ctx.Err(); err != nil {
		return err
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	// Close the response body after we're done.
	defer resp.Body.Close()

	// Check if the call was cancelled before we return the error
	// associated with the call and/or unmarshal the response data.
	if err = ctx.Err(); err != nil {
		return err
	}

	if resp.StatusCode != 200 {
		// TODO: Read the error from the response.
		// This will sometimes (and ideally) be a
		// structured Fern error.
		return errors.New("TODO: error in response")
	}

	// Mutate the response parameter in-place.
	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(response); err != nil {
		return err
	}

	return nil
}

// newRequest returns a new *http.Request with all of the fields
// required to issue the call.
func newRequest(
	ctx context.Context,
	url string,
	method string,
	requestBody io.Reader,
) (*http.Request, error) {
	req, err := http.NewRequest(method, url, requestBody)
	if err != nil {
		return nil, err
	}
	req = req.WithContext(ctx)
	for name, value := range fernHeaders {
		req.Header.Set(name, value)
	}
	return req, nil
}
