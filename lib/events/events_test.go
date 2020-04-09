/*
Copyright 2020 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package events

import (
	"encoding/json"
	"reflect"
	"time"

	"gopkg.in/check.v1"

	"github.com/gravitational/teleport/lib/fixtures"
	"github.com/gravitational/teleport/lib/utils"
)

type EventsTestSuite struct {
	dataDir string
}

var _ = check.Suite(&EventsTestSuite{})

// TestJSON tests JSON marshal events
func (a *EventsTestSuite) TestJSON(c *check.C) {
	type testCase struct {
		name  string
		json  string
		event interface{}
	}
	testCases := []testCase{
		{
			name: "session start event",
			json: `{"ei":0,"event":"session.start","uid":"36cee9e9-9a80-4c32-9163-3d9241cdac7a","code":"T2000I","time":"2020-03-30T15:58:54.561Z","namespace":"default","sid":"5b3555dc-729f-11ea-b66a-507b9dd95841","login":"bob","user":"bob@example.com","server_id":"a7c54b0c-469c-431e-af4d-418cd3ae9694","server_hostname":"planet","server_labels":{"group":"gravitational/devc","kernel":"5.3.0-42-generic","date":"Mon Mar 30 08:58:54 PDT 2020"},"addr.local":"127.0.0.1:3022","addr.remote":"[::1]:37718","size":"80:25"}`,
			event: SessionStart{
				Metadata: Metadata{
					Index: 0,
					Type:  SessionStartEvent,
					ID:    "36cee9e9-9a80-4c32-9163-3d9241cdac7a",
					Code:  SessionStartCode,
					Time:  time.Date(2020, 03, 30, 15, 58, 54, 561*int(time.Millisecond), time.UTC),
				},
				ServerMetadata: ServerMetadata{
					ServerID: "a7c54b0c-469c-431e-af4d-418cd3ae9694",
					ServerLabels: map[string]string{
						"kernel": "5.3.0-42-generic",
						"date":   "Mon Mar 30 08:58:54 PDT 2020",
						"group":  "gravitational/devc",
					},
					ServerHostname: "planet",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "5b3555dc-729f-11ea-b66a-507b9dd95841",
					User:      "bob@example.com",
					Login:     "bob",
				},
				ConnectionMetadata: ConnectionMetadata{
					LocalAddr:  "127.0.0.1:3022",
					RemoteAddr: "[::1]:37718",
				},
				TerminalSize: "80:25",
			},
		},
		{
			name: "resize event",
			json: `{"time":"2020-03-30T15:58:54.564Z","uid":"c34e512f-e6cb-44f1-ab94-4cea09002d29","event":"resize","login":"bob","sid":"5b3555dc-729f-11ea-b66a-507b9dd95841","size":"194:59","ei":1,"code":"T2002I","namespace":"default","server_id":"a7c54b0c-469c-431e-af4d-418cd3ae9694","user":"bob@example.com"}`,
			event: Resize{
				Metadata: Metadata{
					Index: 1,
					Type:  ResizeEvent,
					ID:    "c34e512f-e6cb-44f1-ab94-4cea09002d29",
					Code:  TerminalResizeCode,
					Time:  time.Date(2020, 03, 30, 15, 58, 54, 564*int(time.Millisecond), time.UTC),
				},
				ServerMetadata: ServerMetadata{
					ServerID: "a7c54b0c-469c-431e-af4d-418cd3ae9694",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "5b3555dc-729f-11ea-b66a-507b9dd95841",
					User:      "bob@example.com",
					Login:     "bob",
				},
				TerminalSize: "194:59",
			},
		},
		{
			name: "session end event",
			json: `{"time":"2020-03-30T15:58:54.564Z","uid":"c34e512f-e6cb-44f1-ab94-4cea09002d29","event":"resize","login":"bob","sid":"5b3555dc-729f-11ea-b66a-507b9dd95841","size":"194:59","ei":1,"code":"T2002I","namespace":"default","server_id":"a7c54b0c-469c-431e-af4d-418cd3ae9694","user":"bob@example.com"}`,
			event: Resize{
				Metadata: Metadata{
					Index: 1,
					Type:  ResizeEvent,
					ID:    "c34e512f-e6cb-44f1-ab94-4cea09002d29",
					Code:  TerminalResizeCode,
					Time:  time.Date(2020, 03, 30, 15, 58, 54, 564*int(time.Millisecond), time.UTC),
				},
				ServerMetadata: ServerMetadata{
					ServerID: "a7c54b0c-469c-431e-af4d-418cd3ae9694",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "5b3555dc-729f-11ea-b66a-507b9dd95841",
					User:      "bob@example.com",
					Login:     "bob",
				},
				TerminalSize: "194:59",
			},
		},
		{
			name: "session print event",
			json: `{"time":"2020-03-30T15:58:56.959Z","event":"print","bytes":1551,"ms":2284,"offset":1957,"ei":11,"ci":9}`,
			event: SessionPrint{
				Metadata: Metadata{
					Index: 11,
					Type:  SessionPrintEvent,
					Time:  time.Date(2020, 03, 30, 15, 58, 56, 959*int(time.Millisecond), time.UTC),
				},
				ChunkIndex:        9,
				Bytes:             1551,
				DelayMilliseconds: 2284,
				Offset:            1957,
			},
		},
		{
			name: "session command event",
			json: `{"argv":["/usr/bin/lesspipe"],"login":"alice","path":"/usr/bin/dirname","return_code":0,"time":"2020-03-30T15:58:54.65Z","user":"alice@example.com","code":"T4000I","event":"session.command","pid":31638,"server_id":"a7c54b0c-469c-431e-af4d-418cd3ae9694","uid":"4f725f11-e87a-452f-96ec-ef93e9e6a260","cgroup_id":4294971450,"ppid":31637,"program":"dirname","namespace":"default","sid":"5b3555dc-729f-11ea-b66a-507b9dd95841","ei":4}`,
			event: SessionCommand{
				Metadata: Metadata{
					Index: 4,
					ID:    "4f725f11-e87a-452f-96ec-ef93e9e6a260",
					Type:  SessionCommandEvent,
					Time:  time.Date(2020, 03, 30, 15, 58, 54, 650*int(time.Millisecond), time.UTC),
					Code:  SessionCommandCode,
				},
				ServerMetadata: ServerMetadata{
					ServerID: "a7c54b0c-469c-431e-af4d-418cd3ae9694",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "5b3555dc-729f-11ea-b66a-507b9dd95841",
					User:      "alice@example.com",
					Login:     "alice",
				},
				BPFMetadata: BPFMetadata{
					CgroupID: 4294971450,
					Program:  "dirname",
					PID:      31638,
				},
				PPID:       31637,
				ReturnCode: 0,
				Path:       "/usr/bin/dirname",
				Argv:       []string{"/usr/bin/lesspipe"},
			},
		},
		{
			name: "session network event",
			json: `{"dst_port":443,"cgroup_id":4294976805,"dst_addr":"2607:f8b0:400a:801::200e","program":"curl","sid":"e9a4bd34-78ff-11ea-b062-507b9dd95841","src_addr":"2601:602:8700:4470:a3:813c:1d8c:30b9","login":"alice","pid":17604,"uid":"729498e0-c28b-438f-baa7-663a74418449","user":"alice@example.com","event":"session.network","namespace":"default","time":"2020-04-07T18:45:16.602Z","version":6,"ei":0,"code":"T4002I","server_id":"00b54ef5-ae1e-425f-8565-c71b01d8f7b8"}`,
			event: SessionNetwork{
				Metadata: Metadata{
					Index: 0,
					ID:    "729498e0-c28b-438f-baa7-663a74418449",
					Type:  SessionNetworkEvent,
					Time:  time.Date(2020, 04, 07, 18, 45, 16, 602*int(time.Millisecond), time.UTC),
					Code:  SessionNetworkCode,
				},
				ServerMetadata: ServerMetadata{
					ServerID: "00b54ef5-ae1e-425f-8565-c71b01d8f7b8",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "e9a4bd34-78ff-11ea-b062-507b9dd95841",
					User:      "alice@example.com",
					Login:     "alice",
				},
				BPFMetadata: BPFMetadata{
					CgroupID: 4294976805,
					Program:  "curl",
					PID:      17604,
				},
				DstPort:    443,
				DstAddr:    "2607:f8b0:400a:801::200e",
				SrcAddr:    "2601:602:8700:4470:a3:813c:1d8c:30b9",
				TCPVersion: 6,
			},
		},
		{
			name: "session disk event",
			json: `{"time":"2020-04-07T19:56:38.545Z","login":"bob","pid":31521,"sid":"ddddce15-7909-11ea-b062-507b9dd95841","user":"bob@example.com","ei":175,"code":"T4001I","flags":142606336,"namespace":"default","uid":"ab8467af-6d85-46ce-bb5c-bdfba8acad3f","cgroup_id":4294976835,"program":"clear_console","server_id":"00b54ef5-ae1e-425f-8565-c71b01d8f7b8","event":"session.disk","path":"/etc/ld.so.cache","return_code":3}`,
			event: SessionDisk{
				Metadata: Metadata{
					Index: 175,
					ID:    "ab8467af-6d85-46ce-bb5c-bdfba8acad3f",
					Type:  SessionDiskEvent,
					Time:  time.Date(2020, 04, 07, 19, 56, 38, 545*int(time.Millisecond), time.UTC),
					Code:  SessionDiskCode,
				},
				ServerMetadata: ServerMetadata{
					ServerID: "00b54ef5-ae1e-425f-8565-c71b01d8f7b8",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "ddddce15-7909-11ea-b062-507b9dd95841",
					User:      "bob@example.com",
					Login:     "bob",
				},
				BPFMetadata: BPFMetadata{
					CgroupID: 4294976835,
					Program:  "clear_console",
					PID:      31521,
				},
				Flags:      142606336,
				Path:       "/etc/ld.so.cache",
				ReturnCode: 3,
			},
		},
		{
			name: "successfull user.login event",
			json: `{"ei": 0, "attributes":{"followers_url": "https://api.github.com/users/bob/followers", "err": null, "public_repos": 20, "site_admin": false, "app_metadata":{"roles":["example/admins","example/devc"]}, "emails":[{"email":"bob@example.com","primary":true,"verified":true,"visibility":"public"},{"email":"bob@alternative.com","primary":false,"verified":true,"visibility":null}]},"code":"T1001I","event":"user.login","method":"oidc","success":true,"time":"2020-04-07T18:45:07Z","uid":"019432f1-3021-4860-af41-d9bd1668c3ea","user":"bob@example.com"}`,
			event: UserLogin{
				Metadata: Metadata{
					ID:   "019432f1-3021-4860-af41-d9bd1668c3ea",
					Type: UserLoginEvent,
					Time: time.Date(2020, 04, 07, 18, 45, 07, 0*int(time.Millisecond), time.UTC),
					Code: UserSSOLoginCode,
				},
				User:               "bob@example.com",
				AuthAttemptSuccess: true,
				IdentityAttributes: MustEncodeMap(map[string]interface{}{
					"followers_url": "https://api.github.com/users/bob/followers",
					"err":           nil,
					"public_repos":  20,
					"site_admin":    false,
					"app_metadata":  map[string]interface{}{"roles": []interface{}{"example/admins", "example/devc"}},
					"emails": []interface{}{
						map[string]interface{}{
							"email":      "bob@example.com",
							"primary":    true,
							"verified":   true,
							"visibility": "public",
						},
						map[string]interface{}{
							"email":      "bob@alternative.com",
							"primary":    false,
							"verified":   true,
							"visibility": nil,
						},
					},
				}),
				Method: LoginMethodOIDC,
			},
		},
		{
			name: "session data event",
			json: `{"addr.local":"127.0.0.1:3022","addr.remote":"[::1]:44382","code":"T2006I","ei":2147483646,"event":"session.data","login":"alice","rx":9526,"server_id":"00b54ef5-ae1e-425f-8565-c71b01d8f7b8","sid":"ddddce15-7909-11ea-b062-507b9dd95841","time":"2020-04-07T19:56:39Z","tx":10279,"uid":"cb404873-cd7c-4036-854b-42e0f5fd5f2c","user":"alice@example.com"}`,
			event: SessionData{
				Metadata: Metadata{
					Index: 2147483646,
					ID:    "cb404873-cd7c-4036-854b-42e0f5fd5f2c",
					Type:  SessionDataEvent,
					Time:  time.Date(2020, 04, 07, 19, 56, 39, 0*int(time.Millisecond), time.UTC),
					Code:  SessionDataCode,
				},
				ServerMetadata: ServerMetadata{
					ServerID: "00b54ef5-ae1e-425f-8565-c71b01d8f7b8",
				},
				SessionMetadata: SessionMetadata{
					SessionID: "ddddce15-7909-11ea-b062-507b9dd95841",
					User:      "alice@example.com",
					Login:     "alice",
				},
				ConnectionMetadata: ConnectionMetadata{
					LocalAddr:  "127.0.0.1:3022",
					RemoteAddr: "[::1]:44382",
				},
				BytesReceived:    9526,
				BytesTransmitted: 10279,
			},
		},
		{
			name: "session leave event",
			json: `{"code":"T2003I","ei":39,"event":"session.leave","namespace":"default","server_id":"00b54ef5-ae1e-425f-8565-c71b01d8f7b8","sid":"ddddce15-7909-11ea-b062-507b9dd95841","time":"2020-04-07T19:56:38.556Z","uid":"d7c7489f-6559-42ad-9963-8543e518a058","user":"alice@example.com"}`,
			event: SessionLeave{
				Metadata: Metadata{
					Index: 39,
					ID:    "d7c7489f-6559-42ad-9963-8543e518a058",
					Type:  SessionLeaveEvent,
					Time:  time.Date(2020, 04, 07, 19, 56, 38, 556*int(time.Millisecond), time.UTC),
					Code:  SessionLeaveCode,
				},
				ServerMetadata: ServerMetadata{
					ServerID: "00b54ef5-ae1e-425f-8565-c71b01d8f7b8",
				},
				SessionMetadata: SessionMetadata{
					Namespace: "default",
					SessionID: "ddddce15-7909-11ea-b062-507b9dd95841",
					User:      "alice@example.com",
				},
			},
		},
		{
			name: "user update",
			json: `{"ei": 0, "code":"T1002I","connector":"auth0","event":"user.update","expires":"2020-04-08T02:45:06.524816756Z","roles":["clusteradmin"],"time":"2020-04-07T18:45:07Z","uid":"e7c8e36e-adb4-4c98-b818-226d73add7fc","user":"alice@example.com"}`,
			event: UserUpdate{
				Metadata: Metadata{
					ID:   "e7c8e36e-adb4-4c98-b818-226d73add7fc",
					Type: UserUpdatedEvent,
					Time: time.Date(2020, 4, 7, 18, 45, 7, 0*int(time.Millisecond), time.UTC),
					Code: UserUpdateCode,
				},
				User:      "alice@example.com",
				Expires:   time.Date(2020, 4, 8, 2, 45, 6, 524816756*int(time.Nanosecond), time.UTC),
				Connector: "auth0",
				Roles:     []string{"clusteradmin"},
			},
		},
	}
	for i, tc := range testCases {
		comment := check.Commentf("Test case %v: %v", i, tc.name)
		outJSON, err := utils.FastMarshal(tc.event)
		c.Assert(err, check.IsNil, comment)

		var out map[string]interface{}
		err = json.Unmarshal(outJSON, &out)
		c.Assert(err, check.IsNil, comment)

		// JSON key order is not deterministic when marshaling,
		// this code makes sure intermediate representation is equal
		var expected map[string]interface{}
		err = json.Unmarshal([]byte(tc.json), &expected)
		c.Assert(err, check.IsNil, comment)

		fixtures.DeepCompareMaps(c, out, expected)

		// unmarshal back into the type and compare the values
		outEvent := reflect.New(reflect.TypeOf(tc.event))
		err = json.Unmarshal(outJSON, outEvent.Interface())
		c.Assert(err, check.IsNil, comment)

		fixtures.DeepCompare(c, outEvent.Elem().Interface(), tc.event)
	}
}
