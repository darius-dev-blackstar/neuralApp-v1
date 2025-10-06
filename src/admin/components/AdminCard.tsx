interface AdminCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export default function AdminCard({ title, value, icon, trend, color = "blue" }: AdminCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  const borderClasses = {
    blue: "border-blue-200",
    green: "border-green-200",
    purple: "border-purple-200",
    orange: "border-orange-200",
    red: "border-red-200",
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${borderClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
