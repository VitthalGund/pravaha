from .dairy import DairyTemplate
from .poultry import PoultryTemplate
from .food_processing import FoodProcessingTemplate
from .handicrafts import HandicraftsTemplate
from .retail import RetailTemplate

TEMPLATES = {
    "dairy": DairyTemplate(),
    "poultry": PoultryTemplate(),
    "food_processing": FoodProcessingTemplate(),
    "handicrafts": HandicraftsTemplate(),
    "retail": RetailTemplate(),
}

def get_template(sector: str):
    return TEMPLATES.get(sector, RetailTemplate())
