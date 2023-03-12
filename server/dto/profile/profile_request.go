package profiledto

type ProfileRequest struct {
	ID      int    `json:"id" gorm:"primary_key:auto_increment" validate:"required"`
	Photo   string `json:"photo" gorm:"type: varchar(255)" validate:"required"`
	Phone   string `json:"phone" gorm:"type: varchar(255)" validate:"required"`
	Address string `json:"address" gorm:"type: text" validate:"required"`
	UserID  int    `json:"user_id"`
}
