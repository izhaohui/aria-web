export class Config{

  _rpc = null;
  _token = null;

  constructor(){
    this._rpc = localStorage.getItem("rpc") || null;
    this._token = localStorage.getItem("token") || null;
  }

  public rpc(){
    return this._rpc;
  }

  public token(){
    return this._token;
  }

  public update(rpc: string, token:string){
    this._rpc = rpc;
    this._token = token;
    localStorage.setItem("rpc", rpc);
    localStorage.setItem("token", token);
  }
}
