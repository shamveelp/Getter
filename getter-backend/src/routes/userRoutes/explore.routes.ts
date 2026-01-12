import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { SearchController } from "../../controllers/user/search.controller";

const exploreRouter = Router();
const searchController = container.get<SearchController>(TYPES.ISearchController);

exploreRouter.get("/services", searchController.searchServices);
exploreRouter.get("/services/:id", searchController.getServiceDetail);
exploreRouter.get("/events", searchController.searchEvents);
exploreRouter.get("/events/:id", searchController.getEventDetail);

export default exploreRouter;
