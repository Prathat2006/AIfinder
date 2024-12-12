import json
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    tools = []
    try:
        with open('tools.json', 'r') as file:
            tools = json.load(file)
    except FileNotFoundError:
        print("tools.json file not found.")
    return render_template('index.html', tools=tools)


@app.route('/add', methods=['POST'])
def add_tool():
    name = request.form['tool-name']
    description = request.form['tool-description']
    link = request.form['tool-link']
    tags = request.form['tool-tags']

    if name and description and link and tags:
        new_tool = {
            'name': name,
            'description': description,
            'link': link,
            'tags': tags
        }

        try:
            with open('tools.json', 'r') as file:
                tools = json.load(file)
        except FileNotFoundError:
            tools = []

        tools.append(new_tool)

        with open('tools.json', 'w') as file:
            json.dump(tools, file, indent=4)

    return redirect(url_for('home'))

@app.route('/edit', methods=['POST'])
def edit_tool():
    old_name = request.form['old-name']
    name = request.form['tool-name']
    description = request.form['tool-description']
    link = request.form['tool-link']
    tags = request.form['tool-tags']

    if name and description and link and tags:
        try:
            with open('tools.json', 'r') as file:
                tools = json.load(file)
        except FileNotFoundError:
            tools = []

        for tool in tools:
            if tool['name'] == old_name:
                tool['name'] = name
                tool['description'] = description
                tool['link'] = link
                tool['tags'] = tags

        with open('tools.json', 'w') as file:
            json.dump(tools, file, indent=4)

    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
