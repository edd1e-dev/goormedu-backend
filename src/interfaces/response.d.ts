interface SuccessToken {
  ok: true;
  result: object;
}

interface FailureToken {
  ok: false;
  error: string;
}

type IResultToken = SuccessToken | FailureToken;
