from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/graph-data')
def get_graph_data():
    # 그래프에 사용할 데이터를 JSON으로 반환
    data = {
        'labels': ['January', 'February', 'March', 'April', 'May'],
        'values': [10, 20, 30, 40, 50]
    }

    print("graph.py-data : " + data) 
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
