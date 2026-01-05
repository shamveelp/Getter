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

const container = new Container();

// Repositories
container.bind<IBaseRepository<any>>(TYPES.IBaseRepository).to(BaseRepository);
container.bind<IUserAuthRepository>(TYPES.IUserAuthRepository).to(UserAuthRepository);

// Controllers
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserProfileController>(TYPES.IUserProfileController).to(UserProfileController);

// Services
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IOTPService>(TYPES.IOTPService).to(OTPService);
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IUserProfileService>(TYPES.IUserProfileService).to(UserProfileService);

export default container;