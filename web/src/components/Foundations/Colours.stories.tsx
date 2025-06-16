import React from 'react';

export default { title: 'Foundations/Colours' };

const colors = [
  { name: 'green', className: 'bg-cc-green' },
  { name: 'amber', className: 'bg-cc-amber' },
  { name: 'red', className: 'bg-cc-red' },
];

export const BrandPalette = () => (
  <div className="flex gap-4">
    {colors.map(c => (
      <div key={c.name} className={`${c.className} w-12 h-12 rounded`} />
    ))}
  </div>
);

const spacing = [
  { name: 'xs', value: '0.25rem' },
  { name: 'sm', value: '0.5rem' },
  { name: 'md', value: '1rem' },
  { name: 'lg', value: '1.5rem' },
  { name: 'xl', value: '2rem' },
];

export const SpacingScale = () => (
  <div className="space-y-2">
    {spacing.map(s => (
      <div key={s.name} className="flex items-center">
        <div className="bg-cc-green" style={{ width: s.value, height: '1rem' }} />
        <span className="ml-2 text-sm">{s.name}</span>
      </div>
    ))}
  </div>
);
