import json

input_file_list = ["output/data.json", "output0/data.json", "output1/data.json"]

def read_file(file_path):
    f = open(file_path, "r")
    data = f.read()
    f.close()
    return json.loads(data)

offers = list(map(read_file, input_file_list))

unique_links = []
filtered_offers = []

for offer in offers:
    unique_links.append(offer["link"])

    filter_conditions = [
        offer["isApartment"] == True,
        offer["link"] in unique_links,
        offer["totalApartments"] is None
    ]
    if (not True in filter_conditions):
        filtered_offers.append(offer)

def format_price(price):
    if not price:
        return "NaN"
    return f"{price:,}€"

for offer in sorted(filtered_offers, key=lambda offer : offer["totalCost"]):

    link = offer["link"]
    total_cost_str = format_price(offer["totalCost"])
    per_apartment_str = format_price(offer["costPerApartment"])
    total_apartments = offer["totalApartments"]

    print(link)
    print("total:", total_cost_str)
    print("per apartment:", per_apartment_str)
    print("total apartments:", total_apartments)
    print("is completed:", offer["isCompleted"])
    print()
