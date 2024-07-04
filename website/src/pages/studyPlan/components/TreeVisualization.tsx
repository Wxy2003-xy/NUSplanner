import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';

interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
  nOf?: [number, (PrereqTreeNode | string)[]];
}

interface PrereqTreeProps {
  data?: PrereqTreeNode | undefined;
}

const parsePrereqTree = (data: PrereqTreeNode | string | undefined): any => {
  if (typeof data === 'undefined') {
    return { name: 'NA' };
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

  if (data.nOf) {
    return {
      name: `at least ${data.nOf[0]} of`,
      children: data.nOf[1].map(parsePrereqTree),
    };
  }

  return { name: 'Unknown' };
};

const PrereqTreeVisual: React.FC<PrereqTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const treeLayout = d3.tree().size([height, width]);
    const root = d3.hierarchy(parsePrereqTree(data));
    treeLayout(root);

    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const link = g.append('g')
      .selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    const node = g.append('g')
      .selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    const rectWidth = 100;
    const rectHeight = 30;
    const rectRadius = 10;

    node.append('rect')
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .attr('x', -rectWidth / 2)
      .attr('y', -rectHeight / 2)
      .attr('rx', rectRadius)
      .attr('ry', rectRadius);

    node.append('text')
      .attr('dy', 5)
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .text(d => d.data.name);
  }, [data]);

  return (
    <div className="svg-container">
      <svg className='graph' ref={svgRef} width="800" height="600"></svg>
    </div>
  );
};

export default PrereqTreeVisual;