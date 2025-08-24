export interface LoginPayload {}
export interface LoginResponse {}

export interface RegisterPayload {
  nickname: string;
  password?: string; // Senha pode ser opcional dependendo da sua API
}
