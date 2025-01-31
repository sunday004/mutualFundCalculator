import requests
import pandas as pd

def calculate_average_return():
    base_url = "https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=d26079fc190512773ac705629a92f8ea&file_type=json"
    
    # Set date range for all years
    start_date = "2015-01-01"
    end_date = "2024-12-31"

    start_year = 2015
    end_year = 2024
    
    params = {
        "observation_start": start_date,
        "observation_end": end_date
    }
    


    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Convert to DataFrame
        df = pd.DataFrame(data['observations'])
        df['date'] = pd.to_datetime(df['date'])
        df['value'] = pd.to_numeric(df['value'], errors='coerce')
        df['year'] = df['date'].dt.year
        
        # Remove missing values
        df = df.dropna(subset=['value'])
            
        
        year_count = 0
        total_return = 0

        averages = []
        for year in range(start_year, end_year + 1):
            year_data = df[df['year'] == year]

            year_count += 1

            if not year_data.empty:
                first_day = year_data.iloc[0]
                last_day = year_data.iloc[-1]
                
                year_return = ((last_day['value'] - first_day['value']) / first_day['value'])

                averages.append(float(year_return))
                
                total_return += year_return

        average_return = total_return / year_count
        
        return {
            "average_return": average_return,
            "yearly_returns": averages
        }
        
        
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {str(e)}"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

def print_results(answer):
    if "error" in answer:
        print(f"Error: {answer['error']}")
    else:
        print(f"Average annual return: {answer['average_return']:.4f}")
        print(f"Yearly returns: {answer['yearly_returns']}")

answer = calculate_average_return()
print_results(answer)