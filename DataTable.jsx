import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function DataTable() {
const [data, setData] = useState([]);


useEffect(() => {
// Example backend endpoint
axios.get('http://localhost:8080/api/v1/healthcheck/bit')
.then(response => {
setData(response.data);
})
.catch(error => {
console.error('Error fetching data:', error);
});
}, []);


return (
<div className="p-6">
<h1 className="text-2xl font-bold mb-4">Backend Data Table</h1>
<table className="min-w-full border border-gray-300 rounded-lg">
<thead className="bg-gray-100">
<tr>
{data.length > 0 && Object.keys(data[0]).map((key) => (
<th key={key} className="border p-2 text-left">{key}</th>
))}
</tr>
</thead>
<tbody>
{data.map((row, index) => (
<tr key={index} className="hover:bg-gray-50">
{Object.values(row).map((value, i) => (
<td key={i} className="border p-2">{value}</td>
))}
</tr>
))}
</tbody>
</table>
</div>
);
}