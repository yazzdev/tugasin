import React from 'react';

const ColorPicker = ({ value, onChange, colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(color => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full border-2 ${value === color ? 'border-gray-800' : 'border-transparent'
            }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  );
};

export default ColorPicker;