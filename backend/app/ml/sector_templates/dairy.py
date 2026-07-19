class DairyTemplate:
    def get_seasonal_curve(self, months: int = 12) -> list[float]:
        # Monsoon dip (June-Sept, indices 5-8): milk yields drop due to humidity/fodder transitions
        base = [1.0, 1.05, 1.1, 1.0, 0.95, 0.75, 0.70, 0.72, 0.80, 0.95, 1.05, 1.1]
        return [base[i % 12] for i in range(months)]
