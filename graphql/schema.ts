export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser: User;
  getCurrentPlaying?: Maybe<CurrentPlaying>;
  getTracksHistory: Array<HistoryItem>;
  getCalendarEvents: Array<CalendarEvent>;
  getStation: Station;
  getRecordings: Array<Recording>;
  getHello: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  wasOnlineAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CurrentPlaying = {
  __typename?: 'CurrentPlaying';
  previous: CurrentPlayingTrack;
  current: CurrentPlayingTrack;
  next: CurrentPlayingTrack;
  live: Live;
  timestamp: Scalars['Float'];
  listenersCount: Scalars['Float'];
};

export type CurrentPlayingTrack = {
  __typename?: 'CurrentPlayingTrack';
  id: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
  artist: Scalars['String'];
  startsAt: Scalars['Float'];
  endsAt: Scalars['Float'];
  duration: Scalars['Float'];
  art: Scalars['String'];
};

export type Live = {
  __typename?: 'Live';
  isLive: Scalars['Boolean'];
  streamerName: Scalars['String'];
  broadcastStart: Scalars['Float'];
};

export type HistoryItem = {
  __typename?: 'HistoryItem';
  id: Scalars['Float'];
  playedAt: Scalars['Float'];
  duration: Scalars['Float'];
  playlist: Scalars['String'];
  streamer: Scalars['String'];
  isRequest: Scalars['Boolean'];
  track: Track;
};

export type Track = {
  __typename?: 'Track';
  id: Scalars['String'];
  text: Scalars['String'];
  artist: Scalars['String'];
  title: Scalars['String'];
  album: Scalars['String'];
  lyrics: Scalars['String'];
  art: Scalars['String'];
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  summary: Scalars['String'];
  startsAt: Scalars['Float'];
  endsAt: Scalars['Float'];
};

export type Station = {
  __typename?: 'Station';
  id: Scalars['Float'];
  name: Scalars['String'];
  shortcode: Scalars['String'];
  description: Scalars['String'];
  frontend: Scalars['String'];
  backend: Scalars['String'];
  listenUrl: Scalars['String'];
  public: Scalars['Boolean'];
  playlists: Playlists;
  mounts: Array<Mount>;
};

export type Playlists = {
  __typename?: 'Playlists';
  m3u: Scalars['String'];
  pls: Scalars['String'];
};

export type Mount = {
  __typename?: 'Mount';
  path: Scalars['String'];
  default: Scalars['Boolean'];
  id: Scalars['Float'];
  name: Scalars['String'];
  url: Scalars['String'];
  bitrate: Scalars['Float'];
  format: Scalars['String'];
  listeners: Listeners;
};

export type Listeners = {
  __typename?: 'Listeners';
  current: Scalars['Float'];
  unique: Scalars['Float'];
  total: Scalars['Float'];
};

export type Recording = {
  __typename?: 'Recording';
  name: Scalars['String'];
  img: Scalars['String'];
  year: Scalars['String'];
  desc: Scalars['String'];
  size: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signIn: Token;
  signUp: User;
};

export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSignUpArgs = {
  email: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  id: Scalars['Int'];
  value: Scalars['String'];
  ownerId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  expiresAt?: Maybe<Scalars['DateTime']>;
  usedAt?: Maybe<Scalars['DateTime']>;
};

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignInMutation = { __typename?: 'Mutation' } & {
  signIn: { __typename?: 'Token' } & Pick<Token, 'ownerId' | 'value'>;
};

export type GetCalendarEventsQueryVariables = Exact<{ [key: string]: never }>;

export type GetCalendarEventsQuery = { __typename?: 'Query' } & {
  getCalendarEvents: Array<{ __typename?: 'CalendarEvent' } & Pick<CalendarEvent, 'summary' | 'startsAt' | 'endsAt'>>;
};

export type GetCurrentPlayingQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentPlayingQuery = { __typename?: 'Query' } & {
  getCurrentPlaying?: Maybe<
    { __typename?: 'CurrentPlaying' } & Pick<CurrentPlaying, 'listenersCount' | 'timestamp'> & {
        live: { __typename?: 'Live' } & Pick<Live, 'isLive' | 'streamerName' | 'broadcastStart'>;
        previous: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        current: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        next: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
      }
  >;
};

export type GetGeneralDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetGeneralDataQuery = { __typename?: 'Query' } & {
  getCurrentPlaying?: Maybe<
    { __typename?: 'CurrentPlaying' } & Pick<CurrentPlaying, 'listenersCount' | 'timestamp'> & {
        live: { __typename?: 'Live' } & Pick<Live, 'isLive' | 'streamerName' | 'broadcastStart'>;
        previous: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        current: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
        next: { __typename?: 'CurrentPlayingTrack' } & Pick<
          CurrentPlayingTrack,
          'id' | 'name' | 'title' | 'artist' | 'startsAt' | 'endsAt' | 'duration' | 'art'
        >;
      }
  >;
  getCalendarEvents: Array<{ __typename?: 'CalendarEvent' } & Pick<CalendarEvent, 'summary' | 'startsAt' | 'endsAt'>>;
  getTracksHistory: Array<{ __typename?: 'HistoryItem' } & { track: { __typename?: 'Track' } & Pick<Track, 'text'> }>;
  getStation: { __typename?: 'Station' } & Pick<Station, 'id' | 'name' | 'description'> & {
      playlists: { __typename?: 'Playlists' } & Pick<Playlists, 'm3u'>;
      mounts: Array<
        { __typename?: 'Mount' } & Pick<Mount, 'id' | 'default' | 'path' | 'name' | 'url' | 'bitrate' | 'format'>
      >;
    };
};
