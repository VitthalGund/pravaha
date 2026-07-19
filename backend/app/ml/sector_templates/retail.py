class RetailTemplate:
    def get_seasonal_curve(self, months: int = 12) -> list[float]:
        # Steady baseline with moderate harvest/festival lifts (Oct & April)
        base = [1.0, 0.95, 0.98, 1.05, 0.95, 0.90, 0.92, 0.95, 1.0, 1.15, 1.10, 1.05]
        return [base[i % 12] for i in range(months)]
