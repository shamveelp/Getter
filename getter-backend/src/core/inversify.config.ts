import { Container } from "inversify";
import { TYPES } from "./types";

// Interfaces
import { IUserAuthController } from "./interfaces/controllers/user/IUserAuth.controllers";
import { IUserAuthService } from "./interfaces/services/user/IUserAuth.service";
import { IUserAuthRepository } from "./interfaces/repositories/user/IUserAuth.repository";
import { IOTPService } from "./interfaces/services/IOTP.service";
import { IJwtService } from "./interfaces/services/IJWT.service";
import { IBaseRepository } from "./interfaces/repositories/IBase.repository";
import { IEmailService } from "./interfaces/services/IEmail.service";

// Implementations
import { UserAuthController } from "../controllers/user/userAuth.controller";
import { UserAuthService } from "../services/user/userAuth.service";
import { UserAuthRepository } from "../repositories/user/userAuth.repository";
import { OTPService } from "../services/otp.service";
import { JwtService } from "../utils/jwt";
import { BaseRepository } from "../repositories/base.repository";
import { EmailService } from "../services/email.service";
import { UserProfileController } from "../controllers/user/userProfile.controller";
import { UserProfileService } from "../services/user/userProfile.service";
import { IUserProfileController } from "./interfaces/controllers/user/IUserProfile.controller";
import { IUserProfileService } from "./interfaces/services/user/IUserProfile.service";

// Admin Interfaces
import { IAdminAuthController } from "./interfaces/controllers/admin/IAdminAuth.controller";
import { IAdminAuthService } from "./interfaces/services/admin/IAdminAuth.service";
import { IAdminAuthRepository } from "./interfaces/repositories/admin/IAdminAuth.repository";
import { IAdminCustomerController } from "./interfaces/controllers/admin/IAdminCustomer.controller";
import { IAdminCustomerService } from "./interfaces/services/admin/IAdminCustomer.service";
import { IAdminCustomerRepository } from "./interfaces/repositories/admin/IAdminCustomer.repository";

// Admin Implementations
import { AdminAuthController } from "../controllers/admin/adminAuth.controller";
import { AdminAuthService } from "../services/admin/adminAuth.service";
import { AdminAuthRepository } from "../repositories/admin/adminAuth.repository";
import { AdminCustomerController } from "../controllers/admin/adminCustomer.controller";
import { AdminCustomerService } from "../services/admin/adminCustomer.service";
import { AdminCustomerRepository } from "../repositories/admin/adminCustomer.repository";

// Business Repositories
import { IServiceRepository } from "./interfaces/repositories/IService.repository";

import { IBookingRepository } from "./interfaces/repositories/IBooking.repository";
import { ServiceRepository } from "../repositories/service.repository";

import { BookingRepository } from "../repositories/booking.repository";

// Business Services
import { ServiceService } from "../services/service.service";

import { BookingService } from "../services/booking.service";

// Business Controllers
import { ServiceController } from "../controllers/admin/adminService.controller";

import { BookingController } from "../controllers/user/userBooking.controller";
import { SearchController } from "../controllers/user/userSearch.controller";
import { UploadController } from "../controllers/admin/adminUpload.controller";
import { AdminBookingController } from "../controllers/admin/adminBooking.controller";

const container = new Container();

// Repositories
container.bind<IBaseRepository<any>>(TYPES.IBaseRepository).to(BaseRepository);
container.bind<IUserAuthRepository>(TYPES.IUserAuthRepository).to(UserAuthRepository);
container.bind<IAdminAuthRepository>(TYPES.IAdminAuthRepository).to(AdminAuthRepository);
container.bind<IAdminCustomerRepository>(TYPES.IAdminCustomerRepository).to(AdminCustomerRepository);

// Controllers
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserProfileController>(TYPES.IUserProfileController).to(UserProfileController);
container.bind<IAdminAuthController>(TYPES.IAdminAuthController).to(AdminAuthController);
container.bind<IAdminCustomerController>(TYPES.IAdminCustomerController).to(AdminCustomerController);

// Services
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IOTPService>(TYPES.IOTPService).to(OTPService);
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IUserProfileService>(TYPES.IUserProfileService).to(UserProfileService);
container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);
container.bind<IAdminCustomerService>(TYPES.IAdminCustomerService).to(AdminCustomerService);

// Business Modules
container.bind<IServiceRepository>(TYPES.IServiceRepository).to(ServiceRepository);

container.bind<IBookingRepository>(TYPES.IBookingRepository).to(BookingRepository);

container.bind<ServiceService>(TYPES.IServiceService).to(ServiceService);

container.bind<BookingService>(TYPES.IBookingService).to(BookingService);

container.bind<ServiceController>(TYPES.IServiceController).to(ServiceController);

container.bind<BookingController>(TYPES.IBookingController).to(BookingController);
container.bind<SearchController>(TYPES.ISearchController).to(SearchController);
container.bind<UploadController>(TYPES.IUploadController).to(UploadController);
container.bind<AdminBookingController>(TYPES.IAdminBookingController).to(AdminBookingController);


export default container;