import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface PrereqTreeNode {
    and?: (PrereqTreeNode | string)[];
    or?: (PrereqTreeNode | string)[];
  }

interface PrereqTreeProps {
  data?: PrereqTreeNode | undefined;
}

const parsePrereqTree = (data: PrereqTreeNode | string | undefined): any => {
    if (typeof data === 'undefined') {
      return;
    }

    if (typeof data === 'string') {
      return { name: data };
    }
  
    if (data.and) {
      return {
        name: 'all of',
        children: data.and.map(parsePrereqTree),
      };
    }
  
    if (data.or) {
      return {
        name: 'one of',
        children: data.or.map(parsePrereqTree),
      };
    }
  
    return { name: 'Unknown' };
  };

const PrereqTreeVisual: React.FC<PrereqTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const treeLayout = d3.tree().size([height, width - 160]);
    const root = d3.hierarchy(parsePrereqTree(data));
    treeLayout(root);

    svg.selectAll('*').remove(); // Clear existing contents

    const link = svg.append('g')
      .selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    const node = svg.append('g')
      .selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('r', 10);

    node.append('text')
      .attr('dy', 3)
      .attr('x', d => d.children ? -12 : 12)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name);
  }, [data]);

  return (
    <svg ref={svgRef} width="800" height="600"></svg>
  );
};

export default PrereqTreeVisual;