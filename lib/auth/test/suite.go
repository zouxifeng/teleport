/*
Copyright 2015 Gravitational, Inc.

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

// package test contains CA authority acceptance test suite.
package test

import (
	"time"

	"github.com/gravitational/teleport"
	"github.com/gravitational/teleport/lib/defaults"
	"github.com/gravitational/teleport/lib/services"
	"github.com/gravitational/teleport/lib/sshca"

	"golang.org/x/crypto/ssh"

	"github.com/jonboulle/clockwork"
	"gopkg.in/check.v1"
)

type AuthSuite struct {
	A     sshca.Authority
	Clock clockwork.Clock
}

func (s *AuthSuite) GenerateKeypairEmptyPass(c *check.C) {
	priv, pub, err := s.A.GenerateKeyPair("")
	c.Assert(err, check.IsNil)

	// make sure we can parse the private and public key
	_, err = ssh.ParsePrivateKey(priv)
	c.Assert(err, check.IsNil)

	_, _, _, _, err = ssh.ParseAuthorizedKey(pub)
	c.Assert(err, check.IsNil)
}

func (s *AuthSuite) GenerateKeypairPass(c *check.C) {
	_, pub, err := s.A.GenerateKeyPair("pass1")
	c.Assert(err, check.IsNil)

	// make sure we can parse the private and public key
	// TODO(klizhentas) test the private key actually
	_, _, _, _, err = ssh.ParseAuthorizedKey(pub)
	c.Assert(err, check.IsNil)
}

func (s *AuthSuite) GenerateHostCert(c *check.C) {
	priv, pub, err := s.A.GenerateKeyPair("")
	c.Assert(err, check.IsNil)

	cert, err := s.A.GenerateHostCert(
		services.HostCertParams{
			PrivateCASigningKey: priv,
			CASigningAlg:        defaults.CASignatureAlgorithm,
			PublicHostKey:       pub,
			HostID:              "00000000-0000-0000-0000-000000000000",
			NodeName:            "auth.example.com",
			ClusterName:         "example.com",
			Roles:               teleport.Roles{teleport.RoleAdmin},
			TTL:                 time.Hour,
		})
	c.Assert(err, check.IsNil)

	publicKey, _, _, _, err := ssh.ParseAuthorizedKey(cert)
	c.Assert(err, check.IsNil)

	certificate, ok := publicKey.(*ssh.Certificate)
	c.Assert(ok, check.Equals, true)

	// Check the valid time is not more than 1 minute before the current time.
	validAfter := time.Unix(int64(certificate.ValidAfter), 0)
	c.Assert(validAfter.Unix(), check.Equals, s.Clock.Now().UTC().Add(-1*time.Minute).Unix())

	// Check the valid time is not more than 1 hour after the current time.
	validBefore := time.Unix(int64(certificate.ValidBefore), 0)
	c.Assert(validBefore.Unix(), check.Equals, s.Clock.Now().UTC().Add(1*time.Hour).Unix())
}

func (s *AuthSuite) GenerateUserCert(c *check.C) {
	priv, pub, err := s.A.GenerateKeyPair("")
	c.Assert(err, check.IsNil)

	cert, err := s.A.GenerateUserCert(services.UserCertParams{
		PrivateCASigningKey:   priv,
		CASigningAlg:          defaults.CASignatureAlgorithm,
		PublicUserKey:         pub,
		Username:              "user",
		AllowedLogins:         []string{"centos", "root"},
		TTL:                   time.Hour,
		PermitAgentForwarding: true,
		PermitPortForwarding:  true,
		CertificateFormat:     teleport.CertificateFormatStandard,
	})
	c.Assert(err, check.IsNil)

	publicKey, _, _, _, err := ssh.ParseAuthorizedKey(cert)
	c.Assert(err, check.IsNil)

	certificate, ok := publicKey.(*ssh.Certificate)
	c.Assert(ok, check.Equals, true)

	// Check the valid time is not more than 1 minute before the current time.
	validAfter := time.Unix(int64(certificate.ValidAfter), 0)
	c.Assert(validAfter.Unix(), check.Equals, s.Clock.Now().UTC().Add(-1*time.Minute).Unix())

	// Check the valid time is not more than 1 hour after the current time.
	validBefore := time.Unix(int64(certificate.ValidBefore), 0)
	c.Assert(validBefore.Unix(), check.Equals, s.Clock.Now().UTC().Add(1*time.Hour).Unix())

	_, _, _, _, err = ssh.ParseAuthorizedKey(cert)
	c.Assert(err, check.IsNil)

	_, err = s.A.GenerateUserCert(services.UserCertParams{
		PrivateCASigningKey:   priv,
		CASigningAlg:          defaults.CASignatureAlgorithm,
		PublicUserKey:         pub,
		Username:              "user",
		AllowedLogins:         []string{"root"},
		TTL:                   -20,
		PermitAgentForwarding: true,
		PermitPortForwarding:  true,
		CertificateFormat:     teleport.CertificateFormatStandard,
	})
	c.Assert(err, check.NotNil)

	_, err = s.A.GenerateUserCert(services.UserCertParams{
		PrivateCASigningKey:   priv,
		CASigningAlg:          defaults.CASignatureAlgorithm,
		PublicUserKey:         pub,
		Username:              "user",
		AllowedLogins:         []string{"root"},
		TTL:                   0,
		PermitAgentForwarding: true,
		PermitPortForwarding:  true,
		CertificateFormat:     teleport.CertificateFormatStandard,
	})
	c.Assert(err, check.NotNil)

	_, err = s.A.GenerateUserCert(services.UserCertParams{
		PrivateCASigningKey:   priv,
		CASigningAlg:          defaults.CASignatureAlgorithm,
		PublicUserKey:         pub,
		Username:              "user",
		AllowedLogins:         []string{"root"},
		TTL:                   time.Hour,
		PermitAgentForwarding: true,
		PermitPortForwarding:  true,
		CertificateFormat:     teleport.CertificateFormatStandard,
	})
	c.Assert(err, check.IsNil)

	inRoles := []string{"role-1", "role-2"}
	cert, err = s.A.GenerateUserCert(services.UserCertParams{
		PrivateCASigningKey:   priv,
		CASigningAlg:          defaults.CASignatureAlgorithm,
		PublicUserKey:         pub,
		Username:              "user",
		AllowedLogins:         []string{"root"},
		TTL:                   time.Hour,
		PermitAgentForwarding: true,
		PermitPortForwarding:  true,
		CertificateFormat:     teleport.CertificateFormatStandard,
		Roles:                 inRoles,
	})
	c.Assert(err, check.IsNil)
	parsedKey, _, _, _, err := ssh.ParseAuthorizedKey(cert)
	c.Assert(err, check.IsNil)
	parsedCert, ok := parsedKey.(*ssh.Certificate)
	c.Assert(ok, check.Equals, true)
	outRoles, err := services.UnmarshalCertRoles(parsedCert.Extensions[teleport.CertExtensionTeleportRoles])
	c.Assert(err, check.IsNil)
	c.Assert(outRoles, check.DeepEquals, inRoles)
}
