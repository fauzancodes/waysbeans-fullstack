package authdto

type AuthRequest struct {
	IsAdmin  bool   `json:"is_admin"`
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginRequest struct {
	IsAdmin  bool   `json:"is_admin"`
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}
