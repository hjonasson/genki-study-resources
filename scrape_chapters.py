import os
import json
from bs4 import BeautifulSoup  # type: ignore


with open("index.html") as file:
    soup = BeautifulSoup(file, "html.parser")

# Find the specific ul element with id 'quick-nav-list'
ul_element = soup.find("ul", id="quick-nav-list")

# Find all anchor tags within the specific ul element
anchors = ul_element.find_all("a")

# Iterate over anchor tags to extract hrefs and titles
lesson_data = []
for anchor in anchors:
    href = anchor.get("href")
    title = anchor.get_text(strip=True)

    # Append href and title to lesson_data list
    lesson_data.append({"href": href, "title": title, "tags": "poop"})

# Define the directory to save JSON files
directory = "lessons"

# Create the directory if it doesn't exist
if not os.path.exists(directory):
    os.makedirs(directory)

# Write lesson_data to JSON files
for lesson in lesson_data:
    # Extract href as file name
    file_name = lesson["href"][1:] + ".json"
    file_path = os.path.join(directory, lesson["href"][1:], file_name)

    # Write data to JSON file
    with open(file_path, "w") as f:
        json.dump(lesson, f, indent=4)

    print(f"Data written to {file_path}")
