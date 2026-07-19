class PoultryTemplate:
    def get_seasonal_curve(self, months: int = 12) -> list[float]:
        # Summer heat stress (April-June, indices 3-5): egg production drops, mortality rises
        base = [1.0, 0.98, 0.95, 0.75, 0.70, 0.75, 0.90, 0.95, 1.0, 1.05, 1.08, 1.05]
        return [base[i % 12] for i in range(months)]
