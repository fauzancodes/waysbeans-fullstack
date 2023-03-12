package productdto

type ProductRequest struct {
	Name        string `json:"name" form:"name" validate:"required"`
	Description string `json:"description" form:"description" validate:"required"`
	Price       int    `json:"price" form:"price" validate:"required"`
	Photo       string `json:"photo" form:"photo" validate:"required"`
	Stock       int    `json:"stock" form:"stock" validate:"required"`
}
