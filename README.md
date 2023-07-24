<br/>
<div align="center">
  <a href="https://www.buildwithfern.com/?utm_source=github&utm_medium=readme&utm_campaign=fern-go&utm_content=logo">
    <img src="fern.png" height="120" align="center" alt="header" />
  </a>
  
  <br/>

# Go Generator

[![Contributors](https://img.shields.io/github/contributors/fern-api/fern-go.svg)](https://GitHub.com/dotnet/docs/graphs/contributors/)
[![Pulls-opened](https://img.shields.io/github/issues-pr/fern-api/fern-go.svg)](https://GitHub.com/dotnet/docs/pulls?q=is%3Aissue+is%3Aopened)
[![Pulls-merged](https://img.shields.io/github/issues-search/fern-api/fern-go?label=merged%20pull%20requests&query=is%3Apr%20is%3Aclosed%20is%3Amerged&color=darkviolet)](https://github.com/dotnet/docs/pulls?q=is%3Apr+is%3Aclosed+is%3Amerged)

[![Discord](https://img.shields.io/badge/Join%20Our%20Community-black?logo=discord)](https://discord.com/invite/JkkXumPzcG)

</div>

This repository contains the source for the [Fern](<[https://buildwithfern.com](https://www.buildwithfern.com/?utm_source=github&utm_medium=readme&utm_campaign=fern-go&utm_content=repo-contains)>) generators that produce Go artifacts:

- `fernapi/fern-go-sdk`
- `fernapi/fern-go-model`

The generator is written in Go and produces idiomatic code that feels hand-written and is friendly to read.

Fern handles transforming an API definition -- either an OpenAPI or Fern specification -- into Fern _intermediate representation_. IR is a normalized, Fern-specific definition of an API containing its endpoints, models, errors, authentication scheme, version, and more. Then the Go generator takes over and turns the IR into production-ready code.

## What is Fern?

Fern is an open source toolkit for designing, building, and consuming REST APIs. With Fern, you can generate client libraries, API documentation, and boilerplate for your backend server.

Head over to the [official Fern website](https://www.buildwithfern.com/?utm_source=github&utm_medium=readme&utm_campaign=fern-go&utm_content=homepage) for more information, or head over to our [Documentation](https://www.buildwithfern.com/docs/intro?utm_source=github&utm_medium=readme&utm_campaign=fern-go&utm_content=documentation) to dive straight in and find out what Fern can do for you!

## Generating Go

This generator is used via the [Fern CLI](https://github.com/fern-api/fern), by defining one of the aforementioned Go artifacts as a generator:

```yml
- name: fernapi/fern-go-sdk
  version: 0.0.14
  output:
    location: local-file-system
    path: ../../generated/go
```

By default, Fern runs the generators in the cloud.

## Using local file generation

To run a generator on your local machine, use the `--local` flag for `fern generate`. This will run the generator locally in a Docker container, allowing you to inspect its logs and output. [Read more.](https://buildwithfern.com/docs/compiler/cli-reference#running-locally)

When Fern is configured to generate code locally, it can write its output anywhere
on the local filesystem. The Go generator needs to know where to resolve its import
statements from, so you will either need to add an import path or module configuration
to do so.

### Import path

> This is recommended if you plan to depend on the generated Go SDK from within your project,
> and NOT depend on it as a separate, published Go module.

You can generate the Go SDK code into a `gen/go/api` package with the following `generators.yml`
configuration:

```yaml
default-group: local
groups:
  local:
    generators:
      - name: fernapi/fern-go-sdk
        version: 0.0.14
        config:
          importPath: github.com/<YOUR_ORGANIZATION>/<YOUR_REPOSITORY>/generated/go
        output:
          location: local-file-system
          path: ../../generated/go
```

Note that you will need to update the `<YOUR_ORGANIZATION>` and `<YOUR_REPOSITORY>` placeholders
with the relevant elements in your `go.mod` path.

In this case, the generated Go SDK uses the same `go.mod` path used by the rest of your Go module.

### Module

> This is recommended if you plan to distribute the generated Go SDK as a separate, published Go module.

Alternatively, you can generate the Go SDK code into a separate module (defined with its own `go.mod`)
with the following `generators.yml` configuration:

```yaml
default-group: local
groups:
  local:
    generators:
      - name: fernapi/fern-go-sdk
        version: 0.0.14
        config:
          module:
            path: github.com/<YOUR_ORGANIZATION>/<YOUR_REPOSITORY>
        output:
          location: local-file-system
          path: ../../generated/go
```

This configuration will generate a `go.mod` alongside the rest of the Go SDK code at the target output
location. With this, import statements within the generated Go SDK are all resolved from the configured
module path.

By default, the generated `go.mod` will include a `go` version equivalent to the version of the `go` binary
available on your local machine. You can override this behavior by specifying the `version` key like so:

```yaml
default-group: local
groups:
  local:
    generators:
      - name: fernapi/fern-go-sdk
        version: 0.0.14
        config:
          module:
            path: github.com/<YOUR_ORGANIZATION>/<YOUR_REPOSITORY>
            version: "1.19"
        output:
          location: local-file-system
          path: ../../generated/go
```

Note that if you want to depend on the generated Go SDK locally (without distributing it as a separate Go module),
and you use the `module` configuration option, you will need to modify your project's top-level `go.mod` to
include a [`replace`](https://go.dev/doc/modules/gomod-ref#replace) statement like so:

```
module github.com/your/module

require "github.com/your/sdk" v0.0.0
replace "github.com/your/sdk" v0.0.0 => "path/to/generated/sdk"
```

If you only plan to use the generated SDK within your own Go module, we recommend using the `importPath` configuration
option described above.

## Releases

All generator releases are published in the [Releases section of the GitHub repository](https://github.com/fern-api/fern-go/releases). You can directly use these version numbers in your generator configuration files.

For instance, if you want to use version `0.0.13` of the Go generator:

```yaml
default-group: local
groups:
  local:
    generators:
      - name: fernapi/fern-go-sdk
        version: 0.0.13
        output:
          location: local-file-system
          path: ../../generated/go
```

Fern will handle the rest automatically.

## Contributing

We greatly value community contributions. All the work on Fern generators happens right here on GitHub, both Fern developers and community contributors work together through submitting code via Pull Requests. See the contribution guidelines in [CONTRIBUTING](./CONTRIBUTING.md) on how you can contribute to Fern!

<a href="https://github.com/fern-api/fern-go/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fern-api/fern-go" />
</a>
