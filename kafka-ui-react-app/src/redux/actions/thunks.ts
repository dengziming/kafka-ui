import {
  ApiClustersApi,
  Configuration,
  Cluster,
  Topic,
  TopicFormData,
  TopicConfig,
  SchemaSubject,
} from 'generated-sources';
import {
  ConsumerGroupID,
  PromiseThunk,
  ClusterName,
  BrokerId,
  TopicName,
  TopicMessageQueryParams,
  TopicFormFormattedParams,
  TopicFormDataRaw,
} from 'redux/interfaces';

import { BASE_PARAMS } from 'lib/constants';
import { flatten } from 'lodash';
import * as actions from './actions';

const apiClientConf = new Configuration(BASE_PARAMS);
export const apiClient = new ApiClustersApi(apiClientConf);

export const fetchClustersList = (): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchClusterListAction.request());
  try {
    const clusters: Cluster[] = await apiClient.getClusters();
    dispatch(actions.fetchClusterListAction.success(clusters));
  } catch (e) {
    dispatch(actions.fetchClusterListAction.failure());
  }
};

export const fetchClusterStats = (
  clusterName: ClusterName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchClusterStatsAction.request());
  try {
    const payload = await apiClient.getClusterStats({ clusterName });
    dispatch(actions.fetchClusterStatsAction.success(payload));
  } catch (e) {
    dispatch(actions.fetchClusterStatsAction.failure());
  }
};

export const fetchClusterMetrics = (
  clusterName: ClusterName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchClusterMetricsAction.request());
  try {
    const payload = await apiClient.getClusterMetrics({ clusterName });
    dispatch(actions.fetchClusterMetricsAction.success(payload));
  } catch (e) {
    dispatch(actions.fetchClusterMetricsAction.failure());
  }
};

export const fetchBrokers = (
  clusterName: ClusterName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchBrokersAction.request());
  try {
    const payload = await apiClient.getBrokers({ clusterName });
    dispatch(actions.fetchBrokersAction.success(payload));
  } catch (e) {
    dispatch(actions.fetchBrokersAction.failure());
  }
};

export const fetchBrokerMetrics = (
  clusterName: ClusterName,
  brokerId: BrokerId
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchBrokerMetricsAction.request());
  try {
    const payload = await apiClient.getBrokersMetrics({
      clusterName,
      id: brokerId,
    });
    dispatch(actions.fetchBrokerMetricsAction.success(payload));
  } catch (e) {
    dispatch(actions.fetchBrokerMetricsAction.failure());
  }
};

export const fetchTopicsList = (
  clusterName: ClusterName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchTopicsListAction.request());
  try {
    const topics = await apiClient.getTopics({ clusterName });
    dispatch(actions.fetchTopicsListAction.success(topics));
  } catch (e) {
    dispatch(actions.fetchTopicsListAction.failure());
  }
};

export const fetchTopicMessages = (
  clusterName: ClusterName,
  topicName: TopicName,
  queryParams: Partial<TopicMessageQueryParams>
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchTopicMessagesAction.request());
  try {
    const messages = await apiClient.getTopicMessages({
      clusterName,
      topicName,
      ...queryParams,
    });
    dispatch(actions.fetchTopicMessagesAction.success(messages));
  } catch (e) {
    dispatch(actions.fetchTopicMessagesAction.failure());
  }
};

export const fetchTopicDetails = (
  clusterName: ClusterName,
  topicName: TopicName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchTopicDetailsAction.request());
  try {
    const topicDetails = await apiClient.getTopicDetails({
      clusterName,
      topicName,
    });
    dispatch(
      actions.fetchTopicDetailsAction.success({
        topicName,
        details: topicDetails,
      })
    );
  } catch (e) {
    dispatch(actions.fetchTopicDetailsAction.failure());
  }
};

export const fetchTopicConfig = (
  clusterName: ClusterName,
  topicName: TopicName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchTopicConfigAction.request());
  try {
    const config = await apiClient.getTopicConfigs({ clusterName, topicName });
    dispatch(actions.fetchTopicConfigAction.success({ topicName, config }));
  } catch (e) {
    dispatch(actions.fetchTopicConfigAction.failure());
  }
};

const formatTopicFormData = (form: TopicFormDataRaw): TopicFormData => {
  const {
    name,
    partitions,
    replicationFactor,
    cleanupPolicy,
    retentionBytes,
    retentionMs,
    maxMessageBytes,
    minInSyncReplicas,
    customParams,
  } = form;

  return {
    name,
    partitions,
    replicationFactor,
    configs: {
      'cleanup.policy': cleanupPolicy,
      'retention.ms': retentionMs,
      'retention.bytes': retentionBytes,
      'max.message.bytes': maxMessageBytes,
      'min.insync.replicas': minInSyncReplicas,
      ...Object.values(customParams || {}).reduce(
        (result: TopicFormFormattedParams, customParam: TopicConfig) => {
          return {
            ...result,
            [customParam.name]: customParam.value,
          };
        },
        {}
      ),
    },
  };
};

export const createTopic = (
  clusterName: ClusterName,
  form: TopicFormDataRaw
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.createTopicAction.request());
  try {
    const topic: Topic = await apiClient.createTopic({
      clusterName,
      topicFormData: formatTopicFormData(form),
    });
    dispatch(actions.createTopicAction.success(topic));
  } catch (e) {
    dispatch(actions.createTopicAction.failure());
  }
};

export const updateTopic = (
  clusterName: ClusterName,
  form: TopicFormDataRaw
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.updateTopicAction.request());
  try {
    const topic: Topic = await apiClient.updateTopic({
      clusterName,
      topicName: form.name,
      topicFormData: formatTopicFormData(form),
    });
    dispatch(actions.updateTopicAction.success(topic));
  } catch (e) {
    dispatch(actions.updateTopicAction.failure());
  }
};

export const fetchConsumerGroupsList = (
  clusterName: ClusterName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchConsumerGroupsAction.request());
  try {
    const consumerGroups = await apiClient.getConsumerGroups({ clusterName });
    dispatch(actions.fetchConsumerGroupsAction.success(consumerGroups));
  } catch (e) {
    dispatch(actions.fetchConsumerGroupsAction.failure());
  }
};

export const fetchConsumerGroupDetails = (
  clusterName: ClusterName,
  consumerGroupID: ConsumerGroupID
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchConsumerGroupDetailsAction.request());
  try {
    const consumerGroupDetails = await apiClient.getConsumerGroup({
      clusterName,
      id: consumerGroupID,
    });
    dispatch(
      actions.fetchConsumerGroupDetailsAction.success({
        consumerGroupID,
        details: consumerGroupDetails,
      })
    );
  } catch (e) {
    dispatch(actions.fetchConsumerGroupDetailsAction.failure());
  }
};

export const fetchSchemasByClusterName = (
  clusterName: ClusterName
): PromiseThunk<void> => async (dispatch) => {
  dispatch(actions.fetchSchemasByClusterNameAction.request());
  try {
    const schemaNames = await apiClient.getSchemas({ clusterName });

    // TODO: Remove me after API refactoring
    const schemas: SchemaSubject[][] = await Promise.all(
      schemaNames.map((schemaName) =>
        apiClient.getLatestSchema({ clusterName, schemaName })
      )
    );

    dispatch(actions.fetchSchemasByClusterNameAction.success(flatten(schemas)));
  } catch (e) {
    dispatch(actions.fetchSchemasByClusterNameAction.failure());
  }
};

export const fetchSchemaVersions = (
  clusterName: ClusterName,
  schemaName: SchemaSubject['subject']
  // eslint-disable-next-line consistent-return
): PromiseThunk<void> => async (dispatch) => {
  if (!schemaName) return Promise.resolve();
  dispatch(actions.fetchSchemaVersionsAction.request());
  try {
    const versionIds = await apiClient.getSchemaVersions({
      clusterName,
      schemaName,
    });

    console.log(versionIds);

    const versions: SchemaSubject[][] = await Promise.all(
      versionIds.map((version) =>
        apiClient.getSchemaByVersion({ clusterName, schemaName, version })
      )
    );

    console.log(versions);

    dispatch(actions.fetchSchemaVersionsAction.success(flatten(versions)));
  } catch (e) {
    dispatch(actions.fetchSchemaVersionsAction.failure());
  }
};
