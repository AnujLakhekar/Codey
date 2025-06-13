import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const dataSample = [
  { name: 'Jan', views: 400 },
  { name: 'Feb', views: 300 },
  { name: 'Mar', views: 200 },
];


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pink-400/80 border border-2 border-gray-200 backdrop-blur-md p-3 rounded-lg" >
        <p className="text-white">{label}</p>
        <p style={{ color: "white" }}>{`${payload[0].name}`}
        </p>
      </div>
    );
  }
  return null;
};

export  function DefaultChart({data}) {
  return (
    <div className="flex w-full h-full justify-center items-center">
    <ResponsiveContainer className="bg-pink-900 pr-9 pt-2 flex rounded-lg mt-4 justify-center items-center" width="90%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
  <XAxis
  dataKey="name"
  stroke="black"
  tick={{ fill: "black", fontSize: 12 }}
  axisLine={{ stroke: "black" }}
  tickLine={{ stroke: "black" }}
/>
        <YAxis 
      stroke="black"
  tick={{ fill: "black", fontSize: 12 }}
  axisLine={{ stroke: "black" }}
  tickLine={{ stroke: "black" }} />
        <Tooltip
        content={CustomTooltip}
        />
        <Line type="monotone" dataKey="likes" stroke="black" />
        <Line type="monotone" dataKey="reads" stroke="black" />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}
