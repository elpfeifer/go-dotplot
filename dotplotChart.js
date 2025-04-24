// dotplotChart.js
import * as d3 from 'd3'

export default {
  metadata: {
    name: 'GO Enrichment Dotplot',
    id: 'go-enrichment-dotplot',
    thumbnail: '',
    category: 'Dotplot',
    description: 'Mimics enrichplot-style GO enrichment dotplots.'
  },

  dimensions: {
    x: {
      type: 'number',
      required: true,
      name: 'Gene Ratio'
    },
    y: {
      type: 'string',
      required: true,
      name: 'GO Term'
    },
    size: {
      type: 'number',
      required: true,
      name: 'Gene Count'
    },
    color: {
      type: 'number',
      required: true,
      name: '-log10(FDR)'
    }
  },

  draw: (selection, data, dimensions, context) => {
    const { width, height } = context.chartDimensions
    const margin = { top: 40, right: 30, bottom: 40, left: 200 }

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)]).nice()
      .range([0, innerWidth])

    const y = d3.scaleBand()
      .domain(data.map(d => d.y))
      .range([0, innerHeight])
      .padding(0.3)

    const r = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.size))
      .range([4, 18])

    const color = d3.scaleSequential()
      .domain(d3.extent(data, d => d.color).reverse())
      .interpolator(d3.interpolateRdBu)

    const g = selection.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Circles
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y) + y.bandwidth() / 2)
      .attr('r', d => r(d.size))
      .attr('fill', d => color(d.color))
      .attr('opacity', 0.9)

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))

    g.append('g')
      .call(d3.axisLeft(y))
  }
}
