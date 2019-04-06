import csv

def tot2008():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            total2008 = {rows[0]:[rows[1], rows[2]] for rows in reader}
            del total2008['fips_code']
    return total2008

def d2008():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            dem2008 = {rows[0]:[rows[1], rows[3]] for rows in reader}
            del dem2008['fips_code']
    return dem2008

def g2008():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            gop2008 = {rows[0]:[rows[1], rows[4]] for rows in reader}
            del gop2008['fips_code']
    return gop2008

def tot2012():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            total2012 = {rows[0]:[rows[1], rows[6]] for rows in reader}
            del total2012['fips_code']
    return total2012

def d2012():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            dem2012 = {rows[0]:[rows[1], rows[7]] for rows in reader}
            del dem2012['fips_code']
    return dem2012

def g2012():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            gop2012 = {rows[0]:[rows[1], rows[8]] for rows in reader}
            del gop2012['fips_code']
    return gop2012

def tot2016():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            total2016 = {rows[0]:[rows[1], rows[10]] for rows in reader}
            del total2016['fips_code']
    return total2016

def d2016():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            dem2016 = {rows[0]:[rows[1], rows[11]] for rows in reader}
            del dem2016['fips_code']
    return dem2016

def g2016():
    with open('results.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('res2.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            gop2016 = {rows[0]:[rows[1], rows[12]] for rows in reader}
            del gop2016['fips_code']
    return gop2016
            
print (g2012())
