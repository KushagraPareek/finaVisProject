from flask import Flask,render_template,request
import pandas as pd
import json

app = Flask(__name__)


cases = pd.read_csv('static/data/testing_data.csv')
cases.columns = ['test_month','county','positives','cum_positives','total_tests','cum_tests']

@app.route('/')
def hello_world():
    clean_data()
    return render_template("index.html")


def clean_data():
    global cases_df
    cases_data = cases
    cases_data.drop(['cum_positives','cum_tests'],axis=1,inplace=True)
    cases_data['test_month'] = pd.to_datetime(cases_data['test_month'].str.strip(),format='%m/%d/%Y').dt.month_name()
    cases_df = cases_data.groupby(['test_month','county'],as_index = False).agg({'positives': 'sum', 'total_tests': 'sum'})

@app.route('/colorpleth', methods=["GET","POST"])
def colorpleth():
    if request.method == 'POST':
        month = request.form['month']
        print(month)
        cases_df[cases_df['test_month'] == month]
        county_data = list(zip(cases_df['county'].to_list(),
                              cases_df['positives'].to_list(),cases_df['total_tests'].to_list()))
        return json.dumps({'county_data':county_data})     

