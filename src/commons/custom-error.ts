export default class CustomError extends Error {
  static readonly ErrorType = 'CustomError';

  constructor(message: string = '') {
    super(message);
    this.name = CustomError.ErrorType;
  }
}
