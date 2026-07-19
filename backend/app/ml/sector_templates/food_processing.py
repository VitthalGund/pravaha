class FoodProcessingTemplate:
    def get_seasonal_curve(self, months: int = 12) -> list[float]:
        # Harvest season spike (Oct-Jan, indices 9-0): post-harvest grain milling and processing volume
        base = [1.2, 1.15, 0.95, 0.85, 0.80, 0.75, 0.80, 0.85, 0.95, 1.1, 1.25, 1.3]
        return [base[i % 12] for i in range(months)]
