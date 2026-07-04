export type SignInPayload = {
  username: string
  password: string
}

export type AuthResponse = {
  access_token: string
  token_type: 'bearer'
  role: 'admin' | 'reviewer'
}

export type AuthSession = {
  token: string
  role: AuthResponse['role']
}
