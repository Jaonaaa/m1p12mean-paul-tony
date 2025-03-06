class Response {
  constructor(message, status, data) {
    this.message = message;
    if (data) this.data = data;
    if (status) this.status = status;
  }
}

export const Status = {
  Ok: "Ok",
  Error: "Error",
};

export default Response;
