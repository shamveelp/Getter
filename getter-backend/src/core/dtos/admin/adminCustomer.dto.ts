import { IUser } from "../../../models/user.model";

export class AdminCustomerListResponseDto {
    constructor(
        public users: IUser[],
        public total: number,
        public page: number,
        public limit: number
    ) { }
}

export class AdminCustomerDetailResponseDto {
    constructor(
        public user: IUser
    ) { }
}
