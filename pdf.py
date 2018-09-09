#!/usr/bin/python3

import pydf
from string import Template

beginning_pdf = Template("""
<center>
    <h1>Embrava</h1>
    <h2>${month}'s data summery</h2>
</center>
<br>
<table>
    <tr>
        <th>Date</th><th>Time</th><th>Duration</th><th>Distruction Direction</th>
    </tr>
""")

list_of_items = Template("""
    <tr>
        <td>$date</td><td>$time</td><td>$duration</td><td>$direction</td>
    </tr>
""")

end_of_pdf = "</table>"

beginning_values = {"month":"January"}
list_values = {
    "date":"01-01-2018",
    "time":"12:10:30",
    "duration": "10 seconds",
    "direction": "bottom right"
}
pdf_string = beginning_pdf.substitute(beginning_values)
for i in range(3):
    pdf_string += list_of_items.substitute(list_values)

pdf_string += end_of_pdf

pdf = pydf.generate_pdf(pdf_string)
with open('LiH.pdf', 'wb') as f:
    f.write(pdf)