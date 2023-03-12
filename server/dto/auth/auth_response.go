package authdto

type LoginResponse struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password bool   `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
	Token    string `json:"token"`
}
