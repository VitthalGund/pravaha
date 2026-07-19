class HandicraftsTemplate:
    def get_seasonal_curve(self, months: int = 12) -> list[float]:
        # Festival season spike (Sept-Nov, indices 8-10): Diwali / Dussehra handloom & craft demand
        base = [0.85, 0.85, 0.90, 0.90, 0.85, 0.80, 0.85, 0.95, 1.25, 1.40, 1.35, 1.0]
        return [base[i % 12] for i in range(months)]
