const TYPES = {
    IUserAuthRepository: Symbol.for("IUserAuthRepository"),
    IUserAuthService: Symbol.for("IUserAuthService"),
    IUserAuthController: Symbol.for("IUserAuthController"),
    IOTPService: Symbol.for("IOTPService"),
    IJwtService: Symbol.for("IJwtService"),
    IBaseRepository: Symbol.for("IBaseRepository"),
    IEmailService: Symbol.for("IEmailService"),
    IUserProfileService: Symbol.for("IUserProfileService"),
    IUserProfileController: Symbol.for("IUserProfileController"),
    IAdminAuthRepository: Symbol.for("IAdminAuthRepository"),
    IAdminAuthService: Symbol.for("IAdminAuthService"),
    IAdminAuthController: Symbol.for("IAdminAuthController"),
    IAdminCustomerRepository: Symbol.for("IAdminCustomerRepository"),
    IAdminCustomerService: Symbol.for("IAdminCustomerService"),
    IAdminCustomerController: Symbol.for("IAdminCustomerController"),
};

export { TYPES };