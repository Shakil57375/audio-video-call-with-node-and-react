// class PeerService {
//   constructor() {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });
//     }
//   }

//   async getOffer() {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(offer); // Set local offer description
//       return offer; // Return the offer
//     }
//   }

//   async getAnswer(offer) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(offer)); // Set remote offer description
//       const answer = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(answer); // Set local answer description
//       return answer; // Return the answer
//     }
//   }

//   async setLocalDescription(answer) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(answer)); // Set remote answer description
//     }
//   }
// }

// export default new PeerService();

class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  addTracks(stream) {
    if (this.peer) {
      stream.getTracks().forEach((track) => {
        this.peer.addTrack(track, stream);
      });
    }
  }

  onTrack(callback) {
    if (this.peer) {
      this.peer.ontrack = (event) => {
        callback(event.streams[0]);
      };
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    }
  }

  async setLocalDescription(answer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }
}

export default new PeerService();
