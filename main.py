from core.utils import calculate_percentile


def main():
    values = [100, 200, 300, 400, 500]
    print(calculate_percentile(values, 50))
    print(calculate_percentile(values, 90))


if __name__ == "__main__":
    main()