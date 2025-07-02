import { ElasticSortOrder } from "../src/entities/elastic.sort.order";
import { QueryConditionOptions } from "../src/entities/query.condition.options";
import { QueryType } from "../src/entities/query.type";
import { RangeGreaterThanOrEqual } from "../src/entities/range.greater.than.or.equal";
import { RangeLowerThanOrEqual } from "../src/entities/range.lower.than.or.equal";
import { TermsQuery } from "../src/entities/terms.query";
import { ElasticQuery } from "../src/entities/elastic.query";
import { AbstractQuery } from "../lib/entities/abstract.query";

describe('Elastic Query', () => {
  describe('Create Elastic Query', () => {
    const elasticQuery: ElasticQuery = ElasticQuery.create();

    it('Should return undefined pagination', () => {
      expect(elasticQuery.pagination).toBeUndefined();
    });

    it('Should return empty sort array', () => {
      expect(elasticQuery.sort.length).toEqual(0);
    });

    it('Should return empty filter array', () => {
      expect(elasticQuery.filter.length).toEqual(0);
    });

    it('Should return empty conditions', () => {
      expect(elasticQuery.condition.should.length).toEqual(0);
      expect(elasticQuery.condition.must.length).toEqual(0);
      expect(elasticQuery.condition.must_not.length).toEqual(0);
    });

    it('Should return undefined terms', () => {
      expect(elasticQuery.terms).toBeUndefined();
    });

    it('Should return an match_all query', () => {
      expect(elasticQuery.toJson()).toMatchObject({ query: { match_all: {} } });
    });
  });

  describe('Add pagination to elastic query', () => {
    const elasticQuery: ElasticQuery = ElasticQuery.create();

    elasticQuery.withPagination({ from: 0, size: 1 });
    expect(elasticQuery.pagination?.from).toEqual(0);
    expect(elasticQuery.pagination?.size).toEqual(1);

    expect(elasticQuery.toJson().from).toEqual(0);
    expect(elasticQuery.toJson().size).toEqual(1);
    expect(elasticQuery.toJson().query).toMatchObject({ match_all: {} });

    elasticQuery.withPagination({ from: 10, size: 100 });
    expect(elasticQuery.pagination?.from).toEqual(10);
    expect(elasticQuery.pagination?.size).toEqual(100);

    expect(elasticQuery.toJson().from).toEqual(10);
    expect(elasticQuery.toJson().size).toEqual(100);
    expect(elasticQuery.toJson().query).toMatchObject({ match_all: {} });
  });


  describe('Add sort to elastic query', () => {
    const elasticQuery: ElasticQuery = ElasticQuery.create();

    elasticQuery.withSort([{ name: 'test', order: ElasticSortOrder.descending }]);
    expect(elasticQuery.sort.length).toEqual(1);

    expect(elasticQuery.toJson().sort.toString()).toStrictEqual([{ name: 'test', order: ElasticSortOrder.descending }].toString());
  });

  describe('Add condition to elastic query', () => {
    const elasticQuery: ElasticQuery = ElasticQuery.create();

    elasticQuery.withCondition(QueryConditionOptions.mustNot, [QueryType.Match('test', { test: 'test' })]);
    expect(elasticQuery.condition.must_not.length).toEqual(1);
    expect(elasticQuery.condition.must_not[0].getQuery()).toMatchObject({ match: { test: { test: 'test' } } });

    expect(elasticQuery.toJson().query.bool.must_not).toBeDefined();
  });

  describe('Add range filter to elastic query', () => {
    const elasticQuery1: ElasticQuery = ElasticQuery.create();

    elasticQuery1.withRangeFilter('test', new RangeLowerThanOrEqual(100));
    expect(elasticQuery1.filter.length).toEqual(1);
    expect(elasticQuery1.filter[0].getQuery()).toMatchObject({ range: { test: { lte: '100' } } });

    const elasticQuery2 = ElasticQuery.create();
    elasticQuery2.withRangeFilter('test', new RangeGreaterThanOrEqual(1), new RangeLowerThanOrEqual(100));
    expect(elasticQuery2.filter.length).toEqual(1);
    expect(elasticQuery2.filter[0].getQuery()).toMatchObject({ range: { test: { lte: '100', gte: '1' } } });

    expect(elasticQuery2.toJson().query.bool.filter).toBeDefined();
  });

  describe('Add terms to elastic query', () => {
    const elasticQuery: ElasticQuery = ElasticQuery.create();

    elasticQuery.withTerms(new TermsQuery('test', ['a', 'b', 'c']));
    expect(elasticQuery.terms).toBeDefined();

    expect(elasticQuery.toJson().query.terms).toBeDefined();
  });

  describe('Nested Should query', () => {
    let elasticQuery: ElasticQuery = ElasticQuery.create();

    const textToSearch = "Day One";
    elasticQuery = elasticQuery.withCondition(QueryConditionOptions.must, QueryType.Exists('identifier'));
    elasticQuery = elasticQuery.withMustCondition(QueryType.Match('address', 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex'));
    const conditions: AbstractQuery[] = [];
    conditions.push(QueryType.Wildcard('data.name', `*${textToSearch.toLowerCase()}*`));
    conditions.push(QueryType.Wildcard('data.token', `*${textToSearch.toLowerCase()}*`));

    elasticQuery = elasticQuery.withMustCondition(QueryType.NestedShould('data', conditions));
    expect(elasticQuery).toBeDefined();
    expect(elasticQuery.toJson().query.bool.must[2].nested).toBeDefined();
    expect(elasticQuery.toJson().query.bool.must[2].nested.path).toBe('data');
    expect(elasticQuery.toJson().query.bool.must[2].nested.query.bool.should[0].wildcard).toBeDefined();
    expect(elasticQuery.toJson().query.bool.must[2].nested.query.bool.should[0].wildcard["data.name"].value).toBe('*day one*');
    expect(elasticQuery.toJson().query.bool.must[2].nested.query.bool.should[1].wildcard["data.token"].value).toBe('*day one*');
  });
});
