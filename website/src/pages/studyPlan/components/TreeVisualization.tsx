import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { PrereqTreeNode } from '../../../types/studyplan';
import './TreeVisualization.css';

interface PrereqTreeProps {
  data?: PrereqTreeNode | string;
}

type VisualNodeKind = 'all' | 'any' | 'count' | 'course' | 'empty';

interface VisualNode {
  name: string;
  kind: VisualNodeKind;
  children?: VisualNode[];
}

const normalizeCourseCode = (value: string) => value.replace(/:[A-Z]$/, '');

const parsePrereqTree = (data?: PrereqTreeNode | string): VisualNode => {
  if (!data) return { name: 'No prerequisites', kind: 'empty' };
  if (typeof data === 'string') return { name: normalizeCourseCode(data), kind: 'course' };

  if (data.and?.length) {
    return {
      name: 'All required',
      kind: 'all',
      children: data.and.map(parsePrereqTree),
    };
  }

  if (data.or?.length) {
    return {
      name: 'Choose one',
      kind: 'any',
      children: data.or.map(parsePrereqTree),
    };
  }

  if (data.nOf?.[1]?.length) {
    return {
      name: `Choose ${data.nOf[0]} of ${data.nOf[1].length}`,
      kind: 'count',
      children: data.nOf[1].map(parsePrereqTree),
    };
  }

  return { name: 'No prerequisites', kind: 'empty' };
};

const getTreeStats = (node: VisualNode): { leafCount: number; depth: number } => {
  if (!node.children?.length) return { leafCount: 1, depth: 0 };

  const childStats = node.children.map(getTreeStats);
  return {
    leafCount: childStats.reduce((total, stats) => total + stats.leafCount, 0),
    depth: Math.max(...childStats.map((stats) => stats.depth)) + 1,
  };
};

const PrereqTreeVisual: React.FC<PrereqTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const treeData = useMemo(() => parsePrereqTree(data), [data]);
  const { leafCount, depth } = useMemo(() => getTreeStats(treeData), [treeData]);
  const width = Math.max(400, 150 + depth * 178);
  const height = Math.max(126, 42 + leafCount * 66);

  useEffect(() => {
    if (!svgRef.current || treeData.kind === 'empty') return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const root = d3.hierarchy<VisualNode>(treeData);
    const treeLayout = d3
      .tree<VisualNode>()
      .size([height - 42, Math.max(depth * 178, 1)]);
    treeLayout(root);

    const canvas = svg
      .append('g')
      .attr('class', 'prereq-tree-canvas')
      .attr('transform', 'translate(72,21)');

    canvas
      .append('g')
      .attr('class', 'prereq-links')
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('d', ({ source, target }) => {
        const sourceY = source.y ?? 0;
        const targetY = target.y ?? 0;
        const midpoint = (sourceY + targetY) / 2;
        return `M${sourceY},${source.x}C${midpoint},${source.x} ${midpoint},${target.x} ${targetY},${target.x}`;
      });

    const nodes = canvas
      .append('g')
      .attr('class', 'prereq-nodes')
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('class', ({ data: node }) => `prereq-node prereq-node--${node.kind}`)
      .attr('transform', ({ x, y }) => `translate(${y},${x})`);

    nodes
      .append('rect')
      .attr('x', ({ data: node }) => (node.kind === 'course' ? -55 : -62))
      .attr('y', -19)
      .attr('width', ({ data: node }) => (node.kind === 'course' ? 110 : 124))
      .attr('height', 38)
      .attr('rx', 10);

    nodes
      .append('text')
      .attr('dy', '0.34em')
      .attr('text-anchor', 'middle')
      .text(({ data: node }) => node.name);

    nodes
      .append('title')
      .text(({ data: node }) => {
        if (node.kind === 'all') return 'Complete every branch';
        if (node.kind === 'any') return 'Complete any one branch';
        if (node.kind === 'count') return node.name;
        return node.name;
      });
  }, [depth, height, treeData]);

  if (treeData.kind === 'empty') {
    return (
      <div className="prereq-empty-state">
        <span aria-hidden="true">✓</span>
        <div><strong>No prerequisites</strong><p>This course can be taken without completing another course first.</p></div>
      </div>
    );
  }

  return (
    <div className="svg-container">
      <svg
        ref={svgRef}
        className="prereq-tree-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: `${width}px` }}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Course prerequisite relationship tree"
      />
    </div>
  );
};

export default PrereqTreeVisual;
