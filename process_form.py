# process_form.py
import sys
import json

# Get the form data from the command line argument
form_data = json.loads(sys.argv[1])

# Process the form data (example: just return it as-is)
result = {
    "status": "success",
    "processed_data": form_data,
    "unique link":"google.com"
}

# Print the result as JSON so it can be read in Node.js
print(json.dumps(result))
