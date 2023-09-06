export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdminDocument extends IAdmin {
  createdAt: Date;
  updatedAt: Date;
  _doc?: any;
}
