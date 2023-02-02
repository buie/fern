# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from ......core.datetime_utils import serialize_datetime
from .function_implementation_for_multiple_languages import FunctionImplementationForMultipleLanguages
from .parameter import Parameter


class VoidFunctionDefinitionThatTakesActualResult(pydantic.BaseModel):
    """
    The generated signature will include an additional param, actualResult
    """

    additional_parameters: typing.List[Parameter] = pydantic.Field(alias="additionalParameters")
    code: FunctionImplementationForMultipleLanguages

    class Partial(typing_extensions.TypedDict):
        additional_parameters: typing_extensions.NotRequired[typing.List[Parameter]]
        code: typing_extensions.NotRequired[FunctionImplementationForMultipleLanguages]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @VoidFunctionDefinitionThatTakesActualResult.Validators.root()
            def validate(values: VoidFunctionDefinitionThatTakesActualResult.Partial) -> VoidFunctionDefinitionThatTakesActualResult.Partial:
                ...

            @VoidFunctionDefinitionThatTakesActualResult.Validators.field("additional_parameters")
            def validate_additional_parameters(additional_parameters: typing.List[Parameter], values: VoidFunctionDefinitionThatTakesActualResult.Partial) -> typing.List[Parameter]:
                ...

            @VoidFunctionDefinitionThatTakesActualResult.Validators.field("code")
            def validate_code(code: FunctionImplementationForMultipleLanguages, values: VoidFunctionDefinitionThatTakesActualResult.Partial) -> FunctionImplementationForMultipleLanguages:
                ...
        """

        _pre_validators: typing.ClassVar[
            typing.List[VoidFunctionDefinitionThatTakesActualResult.Validators._PreRootValidator]
        ] = []
        _post_validators: typing.ClassVar[
            typing.List[VoidFunctionDefinitionThatTakesActualResult.Validators._RootValidator]
        ] = []
        _additional_parameters_pre_validators: typing.ClassVar[
            typing.List[VoidFunctionDefinitionThatTakesActualResult.Validators.PreAdditionalParametersValidator]
        ] = []
        _additional_parameters_post_validators: typing.ClassVar[
            typing.List[VoidFunctionDefinitionThatTakesActualResult.Validators.AdditionalParametersValidator]
        ] = []
        _code_pre_validators: typing.ClassVar[
            typing.List[VoidFunctionDefinitionThatTakesActualResult.Validators.PreCodeValidator]
        ] = []
        _code_post_validators: typing.ClassVar[
            typing.List[VoidFunctionDefinitionThatTakesActualResult.Validators.CodeValidator]
        ] = []

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [VoidFunctionDefinitionThatTakesActualResult.Validators._RootValidator],
            VoidFunctionDefinitionThatTakesActualResult.Validators._RootValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [VoidFunctionDefinitionThatTakesActualResult.Validators._PreRootValidator],
            VoidFunctionDefinitionThatTakesActualResult.Validators._PreRootValidator,
        ]:
            ...

        @classmethod
        def root(cls, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if pre:
                    cls._pre_validators.append(validator)
                else:
                    cls._post_validators.append(validator)
                return validator

            return decorator

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["additional_parameters"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [VoidFunctionDefinitionThatTakesActualResult.Validators.PreAdditionalParametersValidator],
            VoidFunctionDefinitionThatTakesActualResult.Validators.PreAdditionalParametersValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls,
            field_name: typing_extensions.Literal["additional_parameters"],
            *,
            pre: typing_extensions.Literal[False] = False,
        ) -> typing.Callable[
            [VoidFunctionDefinitionThatTakesActualResult.Validators.AdditionalParametersValidator],
            VoidFunctionDefinitionThatTakesActualResult.Validators.AdditionalParametersValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["code"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [VoidFunctionDefinitionThatTakesActualResult.Validators.PreCodeValidator],
            VoidFunctionDefinitionThatTakesActualResult.Validators.PreCodeValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["code"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [VoidFunctionDefinitionThatTakesActualResult.Validators.CodeValidator],
            VoidFunctionDefinitionThatTakesActualResult.Validators.CodeValidator,
        ]:
            ...

        @classmethod
        def field(cls, field_name: str, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if field_name == "additional_parameters":
                    if pre:
                        cls._additional_parameters_pre_validators.append(validator)
                    else:
                        cls._additional_parameters_post_validators.append(validator)
                if field_name == "code":
                    if pre:
                        cls._code_pre_validators.append(validator)
                    else:
                        cls._code_post_validators.append(validator)
                return validator

            return decorator

        class PreAdditionalParametersValidator(typing_extensions.Protocol):
            def __call__(
                self, __v: typing.Any, __values: VoidFunctionDefinitionThatTakesActualResult.Partial
            ) -> typing.Any:
                ...

        class AdditionalParametersValidator(typing_extensions.Protocol):
            def __call__(
                self, __v: typing.List[Parameter], __values: VoidFunctionDefinitionThatTakesActualResult.Partial
            ) -> typing.List[Parameter]:
                ...

        class PreCodeValidator(typing_extensions.Protocol):
            def __call__(
                self, __v: typing.Any, __values: VoidFunctionDefinitionThatTakesActualResult.Partial
            ) -> typing.Any:
                ...

        class CodeValidator(typing_extensions.Protocol):
            def __call__(
                self,
                __v: FunctionImplementationForMultipleLanguages,
                __values: VoidFunctionDefinitionThatTakesActualResult.Partial,
            ) -> FunctionImplementationForMultipleLanguages:
                ...

        class _PreRootValidator(typing_extensions.Protocol):
            def __call__(self, __values: typing.Any) -> typing.Any:
                ...

        class _RootValidator(typing_extensions.Protocol):
            def __call__(
                self, __values: VoidFunctionDefinitionThatTakesActualResult.Partial
            ) -> VoidFunctionDefinitionThatTakesActualResult.Partial:
                ...

    @pydantic.root_validator(pre=True)
    def _pre_validate(
        cls, values: VoidFunctionDefinitionThatTakesActualResult.Partial
    ) -> VoidFunctionDefinitionThatTakesActualResult.Partial:
        for validator in VoidFunctionDefinitionThatTakesActualResult.Validators._pre_validators:
            values = validator(values)
        return values

    @pydantic.root_validator(pre=False)
    def _post_validate(
        cls, values: VoidFunctionDefinitionThatTakesActualResult.Partial
    ) -> VoidFunctionDefinitionThatTakesActualResult.Partial:
        for validator in VoidFunctionDefinitionThatTakesActualResult.Validators._post_validators:
            values = validator(values)
        return values

    @pydantic.validator("additional_parameters", pre=True)
    def _pre_validate_additional_parameters(
        cls, v: typing.List[Parameter], values: VoidFunctionDefinitionThatTakesActualResult.Partial
    ) -> typing.List[Parameter]:
        for validator in VoidFunctionDefinitionThatTakesActualResult.Validators._additional_parameters_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("additional_parameters", pre=False)
    def _post_validate_additional_parameters(
        cls, v: typing.List[Parameter], values: VoidFunctionDefinitionThatTakesActualResult.Partial
    ) -> typing.List[Parameter]:
        for validator in VoidFunctionDefinitionThatTakesActualResult.Validators._additional_parameters_post_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("code", pre=True)
    def _pre_validate_code(
        cls, v: FunctionImplementationForMultipleLanguages, values: VoidFunctionDefinitionThatTakesActualResult.Partial
    ) -> FunctionImplementationForMultipleLanguages:
        for validator in VoidFunctionDefinitionThatTakesActualResult.Validators._code_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("code", pre=False)
    def _post_validate_code(
        cls, v: FunctionImplementationForMultipleLanguages, values: VoidFunctionDefinitionThatTakesActualResult.Partial
    ) -> FunctionImplementationForMultipleLanguages:
        for validator in VoidFunctionDefinitionThatTakesActualResult.Validators._code_post_validators:
            v = validator(v, values)
        return v

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        frozen = True
        allow_population_by_field_name = True
        extra = pydantic.Extra.forbid
        json_encoders = {dt.datetime: serialize_datetime}
