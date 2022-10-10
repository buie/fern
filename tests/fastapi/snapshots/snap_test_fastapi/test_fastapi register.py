import fastapi

from .core.abstract_fern_service import AbstractFernService
from .core.exceptions import FernHTTPException
from .resources.admin.service import AbstractAdminService
from .resources.homepage.service import AbstractHomepageProblemService
from .resources.migration.service import AbstractMigrationInfoService
from .resources.playlist.service import AbstractPlaylistCrudService
from .resources.problem.service import AbstractProblemCrudService
from .resources.submission.service import AbstractExecutionSesssionManagementService
from .resources.sysprop.service import AbstractSysPropCrudService
from .resources.v_2.problem.service import (
    AbstractProblemInfoServicV2 as resources_v_2_problem_service_AbstractProblemInfoServicV2,
)
from .resources.v_2.v_3.problem.service import (
    AbstractProblemInfoServicV2 as resources_v_2_v_3_problem_service_AbstractProblemInfoServicV2,
)


def register(
    app: fastapi.FastAPI,
    *,
    admin: AbstractAdminService,
    homepage: AbstractHomepageProblemService,
    migration: AbstractMigrationInfoService,
    playlist: AbstractPlaylistCrudService,
    problem: AbstractProblemCrudService,
    submission: AbstractExecutionSesssionManagementService,
    sysprop: AbstractSysPropCrudService,
    v_2_problem: resources_v_2_problem_service_AbstractProblemInfoServicV2,
    v_2_v_3_problem: resources_v_2_v_3_problem_service_AbstractProblemInfoServicV2
) -> None:
    app.include_router(__register_service(admin))
    app.include_router(__register_service(homepage))
    app.include_router(__register_service(migration))
    app.include_router(__register_service(playlist))
    app.include_router(__register_service(problem))
    app.include_router(__register_service(submission))
    app.include_router(__register_service(sysprop))
    app.include_router(__register_service(v_2_problem))
    app.include_router(__register_service(v_2_v_3_problem))

    @app.exception_handler(FernHTTPException)
    def _exception_handler(request: fastapi.requests.Request, exc: FernHTTPException) -> fastapi.responses.JSONResponse:
        return exc.to_json_response()


def __register_service(service: AbstractFernService) -> fastapi.APIRouter:
    router = fastapi.APIRouter()
    type(service)._init_fern(router)
    return router
