var clusterLib = requireWithCoverage('cluster');


describe('cluster', function () {
	var
		cluster,
		defaultOptions;

	beforeEach(function () {
		defaultOptions = {
			_index : 'dieties',
			_type : 'kitteh',
			auth : '',
			hostname : 'localhost',
			port : 9200,
			rejectUnauthorized : true,
			secure : false
		};

		requestError = null;

		cluster = clusterLib(defaultOptions, req);
	});

	describe('#fieldStats', function () {
		it('should allow field', function (done) {
			var options = {
				field : 'breed'
			};

			cluster.fieldStats(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_nodes/stats/indices/fielddata/breed');

				done();
			});
		});

		it('should allow field to an array', function (done) {
			var options = {
				fields : ['breed', 'name'],
				os : true,
				process : true
			};

			cluster.fieldStats(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_nodes/stats/indices/fielddata/breed,name?os=true&process=true');

				done();
			});
		});

		it('should require field to be present', function (done) {
			cluster.fieldStats(function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});
	});

	describe('#health', function () {
		it('should properly reflect method and path when called', function (done) {
			cluster.health({}, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/health');

				done();
			});
		});

		it('options should be optional', function (done) {
			cluster.health(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/health');

				done();
			});
		});
	});

	describe('#nodeInfo', function () {
		it('should properly reflect method and path when called', function (done) {
			cluster.nodeInfo({}, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes');

				done();
			});
		});

		it('options should be optional', function (done) {
			cluster.nodeInfo(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes');

				done();
			});
		});

		it('should reflect a single node when requested', function (done) {
			var options = {
				node : 'superman'
			};

			cluster.nodeInfo(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/superman');

				done();
			});
		});

		it('should reflect multiple nodes when requested', function (done) {
			var options = {
				nodes : ['superman', 'batman']
			};

			cluster.nodeInfo(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/superman,batman');

				done();
			});
		});

		it('should support node when indicated in default config', function (done) {
			defaultOptions.node = 'batman';
			cluster.nodeInfo(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/batman');

				delete defaultOptions.node;

				done();
			});
		});

		it('should also support nodes when indicated in default config', function (done) {
			defaultOptions.nodes = ['superman', 'batman'];
			cluster.nodeInfo(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/superman,batman');

				delete defaultOptions.nodes;

				done();
			});
		});
	});

	describe('#nodeStats', function () {
		it('should properly reflect method and path when called', function (done) {
			cluster.nodeStats({}, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/stats');

				done();
			});
		});

		it('options should be optional', function (done) {
			cluster.nodeStats(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/stats');

				done();
			});
		});

		it('should reflect a node when requested', function (done) {
			var options = {
				node : 'superman'
			};

			cluster.nodeStats(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/nodes/superman/stats');

				done();
			});
		});
	});

	describe('#settings', function () {
		it('should properly reflect method and path when called', function (done) {
			cluster.settings({}, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/settings');

				done();
			});
		});

		it('options should be optional', function (done) {
			cluster.settings(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/settings');

				done();
			});
		});
	});

	describe('#state', function () {
		it('should properly reflect method and path when called', function (done) {
			cluster.state({ filter_nodes : true }, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/state?filter_nodes=true');

				done();
			});
		});

		it('options should be optional', function (done) {
			cluster.state(function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('GET');
				data.options.path.should.equals('_cluster/state');

				done();
			});
		});
	});

	describe('#updateSettings', function () {
		var update = {
			transient : {
				'discovery.zen.minimum_master_nodes' : 2
			}
		};

		it('should properly reflect method and path when called', function (done) {
			cluster.updateSettings({}, update, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('PUT');
				data.options.path.should.equals('_cluster/settings');

				done();
			});
		});

		it('options should be optional', function (done) {
			cluster.updateSettings(update, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.options.method.should.equals('PUT');
				data.options.path.should.equals('_cluster/settings');

				done();
			});
		});
	});
});