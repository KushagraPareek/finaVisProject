from flask import Flask,render_template,request
import pandas as pd
import json

app = Flask(__name__)


cases = pd.read_csv('static/data/testing_data.csv')
cases.columns = ['test_month','county','positives','cum_positives','total_tests','cum_tests']
radar_data = pd.read_csv('static/data/radardata.csv')
case_load_data = pd.read_csv('static/data/radar_data.csv')

@app.route('/')
def hello_world():
    clean_data()
    return render_template("index.html")


def clean_data():
    
    global cases_data    
    
    cases_data = pd.read_csv('static/data/testing_data.csv')
    cases_data.columns = ['test_date','county','positives','cum_positives','total_tests','cum_tests']
    cases_data.drop(['cum_positives','cum_tests'],axis=1,inplace=True)
    cases_data['test_month'] = pd.to_datetime(cases_data['test_date'].str.strip(),format='%m/%d/%Y').dt.month_name()
    

@app.route('/colorpleth', methods=["GET","POST"])
def colorpleth():
    if request.method == 'POST':
        month = request.form['month']
        cases_df = cases_data.groupby(['test_month','county'],as_index = False).agg({'positives': 'sum', 'total_tests': 'sum'})
        cases_month = cases_df[cases_df['test_month'] == month]
        county_data = list(zip(cases_month['county'].to_list(),
                              cases_month['positives'].to_list(),cases_month['total_tests'].to_list()))
        return json.dumps({'county_data':county_data})     


@app.route('/timeData', methods=["GET","POST"])
def timeData():
    if request.method == 'POST':
        month  = request.form['month']
        county = request.form['county']
        cases_month  = cases_data[cases_data['test_month'] == month]
        cases_county = cases_month[cases_month['county']  == county]
        time_data = list(zip(cases_county['test_date'].to_list(),
                              cases_county['positives'].to_list(),cases_county['total_tests'].to_list()))

        return json.dumps({'time_data':time_data})



@app.route('/timeDataFull', methods=["GET","POST"])
def timeDataFull():
    if request.method == 'POST':
        county = request.form['county']
        cases_county = cases_data[cases_data['county']  == county]
        time_data = list(zip(cases_county['test_date'].to_list(),
                              cases_county['positives'].to_list(),cases_county['total_tests'].to_list()))

        return json.dumps({'time_data':time_data})


@app.route('/compareCounties', methods=["GET","POST"])
def compareCountie():
    if request.method == 'POST':
        time_data = list(zip(case_load_data['County'].to_list(),
                              case_load_data['TotalPositives'].to_list(),case_load_data['CaseLoad'].to_list()))

        return json.dumps({'time_data':time_data})

@app.route('/radar', methods =['GET','POST'])
def radar():
    if request.method == 'POST':
        search = request.get_json()
        counties = search['selected_counties_name']
        print("counties: ",counties)
        county1=counties[0]
        county2=counties[1]
        county3=counties[2]
        county1_data = radar_data[radar_data['County'] == county1]
        county2_data = radar_data[radar_data['County'] == county2]
        county3_data = radar_data[radar_data['County'] == county3]
        data = {}
        data['county1'] = county1_data.to_json(orient='records')
        data['county2'] = county2_data.to_json(orient='records')
        data['county3'] = county3_data.to_json(orient='records')
        print(data)
        return data 