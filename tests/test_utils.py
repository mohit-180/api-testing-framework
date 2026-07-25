from core.utils import build_full_url, calculate_percentile, format_ms


def test_calculate_percentile_single_value():
    assert calculate_percentile([10.0], 50) == 10.0
    assert calculate_percentile([10.0], 99) == 10.0


def test_calculate_percentile_multiple():
    data = [10.0, 20.0, 30.0, 40.0, 50.0]
    assert calculate_percentile(data, 0) == 10.0
    assert calculate_percentile(data, 100) == 50.0
    assert calculate_percentile(data, 50) == 30.0


def test_build_full_url():
    assert build_full_url("https://api.com/", "/get") == "https://api.com/get"
    assert build_full_url("https://api.com", "get") == "https://api.com/get"
    assert build_full_url("https://api.com/v1/", "//get") == "https://api.com/v1/get"


def test_format_ms():
    assert format_ms(123.456) == "123.46 ms"
    assert format_ms(0.0) == "0.00 ms"
